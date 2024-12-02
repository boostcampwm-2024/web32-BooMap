import { Controller, Logger, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AiService } from './ai.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../decorators';
import { ALLOW_AUDIO_FILE_FORMAT, MAX_FILE_SIZE } from 'apps/api-server/common/constant';
import { FileValidationPipe } from '../../pipes';

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);
  constructor(private readonly aiService: AiService) {}

  @Post('audio/:mindmapId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('aiAudio', { limits: { fileSize: MAX_FILE_SIZE } }))
  async uploadAudioFile(
    @User() user,
    @UploadedFile(new FileValidationPipe(ALLOW_AUDIO_FILE_FORMAT)) audioFile: Express.Multer.File,
  ) {
    console.log(user);
    console.log(audioFile);
  }
}
