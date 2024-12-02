import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  constructor(private readonly allowExtensions: string[]) {}

  transform(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const ext = extname(file.originalname).toLowerCase();

    if (!this.allowExtensions.includes(ext)) {
      throw new BadRequestException(`File type not allowed. Only ${this.allowExtensions.join(', ')} allowed`);
    }

    return file;
  }
}
