export const MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
export const ALLOW_AUDIO_FILE_FORMAT = ['.m4a', '.ogg', '.ac3', '.aac', '.mp3'];
export const OPENAI_PROMPT = `- 당신은 텍스트 요약 어시스턴트입니다.
- 주어진 텍스트를 분석하고 핵심 단어들을 추출해 대분류, 중분류, 소분류로 나눠주세요.
- 각 하위 분류는 상위 분류에 연관되는 키워드여야 합니다.
- 반드시 대분류는 한개여야 합니다.
- 각 객체에는 핵심 단어를 나타내는 keyword와 자식요소를 나타내는 children이 있으며, children의 경우 객체들을 포함한 배열입니다. 
- children 배열에는 개별 요소를 나타내는 객체가 들어갑니다.
- 개별 요소는 keyword (문자열), children (배열)을 가집니다.
- 마지막 자식 요소 또한 children을 필수적으로 빈 배열을 가지고 있습니다.
- keyword 는 짧고 간결하게 해주세요.
- keyword의 갯수는 최대 60개로 제한을 둡니다.
- tree 구조의 최대 depth는 4입니다.
- 불필요한 띄어쓰기와 줄바꿈 문자는 제거합니다.
- \`\`\` json \`\`\` 은 빼고 결과를 출력합니다.`;
