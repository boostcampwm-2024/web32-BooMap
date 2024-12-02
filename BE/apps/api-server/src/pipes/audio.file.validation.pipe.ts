import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ALLOW_AUDIO_FILE_FORMAT } from 'apps/api-server/common/constant';
import { extname } from 'path';

@Injectable()
export class AudioFileValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = extname(file.originalname).toLowerCase();
    console.log(ext);

    if (!ALLOW_AUDIO_FILE_FORMAT.includes(ext)) {
      throw new BadRequestException(`File type not allowed. Only ${ALLOW_AUDIO_FILE_FORMAT.join(', ')} allowed`);
    }

    return file;
  }
}
