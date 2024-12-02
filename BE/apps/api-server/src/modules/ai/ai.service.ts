import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NodeService } from '../node/node.service';
import { ConfigService } from '@nestjs/config';
import { RedisMessage } from '../subscriber/subscriber.service';
import { PublisherService } from '@app/publisher';

export interface TextAiResponse {
  keyword: string;
  children: TextAiResponse[];
}
const BAD_WORDS_REGEX =
  /[시씨씪슈쓔쉬쉽쒸쓉](?:[0-9]*|[0-9]+ *)[바발벌빠빡빨뻘파팔펄]|[섊좆좇졷좄좃좉졽썅춍봊]|[ㅈ조][0-9]*까|ㅅㅣㅂㅏㄹ?|ㅂ[0-9]*ㅅ|[ㅄᄲᇪᄺᄡᄣᄦᇠ]|[ㅅㅆᄴ][0-9]*[ㄲㅅㅆᄴㅂ]|[존좉좇][0-9 ]*나|[자보][0-9]+지|보빨|[봊봋봇봈볻봁봍] *[빨이]|[후훚훐훛훋훗훘훟훝훑][장앙]|[엠앰]창|애[미비]|애자|[가-탏탑-힣]색기|(?:[샊샛세쉐쉑쉨쉒객갞갟갯갰갴겍겎겏겤곅곆곇곗곘곜걕걖걗걧걨걬] *[끼키퀴])|새 *[키퀴]|[병븅][0-9]*[신딱딲]|미친[가-닣닥-힣]|[믿밑]힌|[염옘][0-9]*병|[샊샛샜샠섹섺셋셌셐셱솃솄솈섁섂섓섔섘]기|[섹섺섻쎅쎆쎇쎽쎾쎿섁섂섃썍썎썏][스쓰]|[지야][0-9]*랄|니[애에]미|갈[0-9]*보[^가-힣]|[뻐뻑뻒뻙뻨][0-9]*[뀨큐킹낑)|꼬[0-9]*추|곧[0-9]*휴|[가-힣]슬아치|자[0-9]*박꼼|빨통|[사싸](?:이코|가지|[0-9]*까시)|육[0-9]*시[랄럴]|육[0-9]*실[알얼할헐]|즐[^가-힣]|찌[0-9]*(?:질이|랭이)|찐[0-9]*따|찐[0-9]*찌버거|창[녀놈]|[가-힣]{2,}충[^가-힣]|[가-힣]{2,}츙|부녀자|화냥년|환[양향]년|호[0-9]*[구모]|조[선센][징]|조센|[쪼쪽쪾](?:[발빨]이|[바빠]리)|盧|무현|찌끄[레래]기|(?:하악){2,}|하[앍앜]|[낭당랑앙항남담람암함][ ]?[가-힣]+[띠찌]|느[금급]마|文在|在寅|(?<=[^\n])[家哥]|속냐|[tT]l[qQ]kf|Wls|[ㅂ]신|[ㅅ]발|[ㅈ]밥/;
const CLOVA_X_PROMPT =
  '- 당신은 텍스트 요약 어시스턴트입니다.\r\n- 주어진 텍스트를 분석하고 핵심 단어들을 추출해 대분류, 중분류, 소분류로 나눠주세요.\n- 반드시 대분류는 한개여야 합니다.\r\n- JSON 트리 구조의 데이터로 만들어주세요.\r\n- 각 객체에는 핵심 단어를 나타내는 keyword와 부모자식요소를 나타내는 children이 있으며, children의 경우 객체들을 포함한 배열입니다. \r\n- 마지막 자식 요소 또한 children을 필수적으로 빈 배열([])을 가지고 있습니다.\n- 개별 요소는 keyword (문자열), children (배열)을 가집니다.\n- keyword 는 최대한 짧고 간결하게 해주세요.\r\n- children 배열에는 개별 요소를 나타내는 객체가 들어갑니다.\r\n- children을 통해 나타내는 트리 구조의 깊이는 2를 넘을 수 없습니다.\r\n- keyword는 최대 50개로 제한을 둡니다.\n- 띄어쓰기와 줄바꿈 문자는 제거합니다.\n- 데이터 형태는 아래와 같습니다.\n- "{"keyword": "점심메뉴", "children": [{"keyword": "중식","children": [{"keyword": "짜장면","children": []},{"keyword": "짬뽕","children": []},{"keyword": "탕수육","children": []},{"keyword": "깐풍기","children": []}]},{"keyword": "일식","children": [{"keyword": "초밥","children": []},{"keyword": "오꼬노미야끼","children": []},{"keyword": "장어덮밥","children": []}]},{"keyword": "양식","children": [{"keyword": "파스타","children": []},{"keyword": "스테이크","children": []}]},{"keyword": "한식","children": [{"keyword": "김치찌개 ","children": []}]}]}" 와 같은 데이터 처럼 마지막 자식 요소가 자식이 없어도 빈 배열을 가지고 있어야합니다.';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly nodeService: NodeService,
    private readonly publisherService: PublisherService,
  ) {}

  async requestClovaX(data: RedisMessage['data']) {
    try {
      if (BAD_WORDS_REGEX.test(data.aiContent)) {
        this.publisherService.publish(
          'api-socket',
          JSON.stringify({ event: 'textAi', data: { error: '욕설이 포함되어 있습니다.' } }),
        );
        return;
      }

      const URL = this.configService.get('CLOVA_URL');
      const headers = {
        'X-NCP-CLOVASTUDIO-API-KEY': this.configService.get('X_NCP_CLOVASTUDIO_API_KEY'),
        'X-NCP-APIGW-API-KEY': this.configService.get('X_NCP_APIGW_API_KEY'),
        'X-NCP-CLOVASTUDIO-REQUEST-ID': this.configService.get('X_NCP_CLOVASTUDIO_REQUEST_ID'),
        'Content-Type': 'application/json',
      };

      const messages = [
        {
          role: 'system',
          content: CLOVA_X_PROMPT,
        },
        {
          role: 'user',
          content: data.aiContent,
        },
      ];

      const requestData = {
        messages,
        topP: 0.8,
        topK: 0,
        maxTokens: 2272,
        temperature: 0.06,
        repeatPenalty: 5.0,
        stopBefore: [],
        includeAiFilters: false,
        seed: 0,
      };

      const response = await firstValueFrom(this.httpService.post(URL, requestData, { headers }));

      let result: string = response.data.result.message.content;

      if (result[result.length - 1] !== '}') {
        result = result + '}';
      }

      const resultJson = JSON.parse(result) as TextAiResponse;
      const nodeData = await this.nodeService.aiCreateNode(resultJson, Number(data.mindmapId));

      this.publisherService.publish(
        'api-socket',
        JSON.stringify({ event: 'textAiSocket', data: { nodeData, connectionId: data.connectionId } }),
      );
    } catch (error) {
      this.logger.error('텍스트 AI 요청 에러 : ' + error);
      this.publisherService.publish(
        'api-socket',
        JSON.stringify({ event: 'textAiSocket', data: { error: 'AI 요청에 실패했습니다.' } }),
      );
    }
  }
}
