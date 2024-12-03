import { Body, Controller, Logger, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators';
import { MAX_FILE_SIZE } from 'apps/api-server/src/common/constant';
import { AudioFileValidationPipe } from '../../pipes';
import { AudioUploadDto } from './dto/audio.upload.dto';
import { AiDto } from './dto/ai.dto';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private readonly aiService: AiService) {}

  @Post('audio')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('aiAudio', { limits: { fileSize: MAX_FILE_SIZE } }))
  async uploadAudioFile(
    @UploadedFile(new AudioFileValidationPipe()) audioFile: Express.Multer.File,
    @User() user: { id: number; email: string },
    @Body() audioUploadDto: AudioUploadDto,
  ) {
    this.logger.log(`User ${user.id} uploaded audio file`);
    await this.aiService.requestClovaSpeech(audioFile, audioUploadDto);
    return;
  }

  @Post('openai')
  @UseGuards(AuthGuard('jwt'))
  async requestOpenAi(@Body() aiDto: AiDto) {
    await this.aiService.requestOpenAi(aiDto);
    return;
  }
}
