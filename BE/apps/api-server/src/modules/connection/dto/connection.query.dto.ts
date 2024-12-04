import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsString, ValidateIf } from 'class-validator';

export class ConnectionQueryDto {
  @IsString()
  @IsIn(['mindmap', 'connection'])
  type: string;

  @Transform(({ value, obj }) => {
    return obj.type === 'mindmap' ? Number(value) : value;
  })
  @ValidateIf((o) => o.type === 'mindmap')
  @IsNumber()
  @ValidateIf((o) => o.type === 'connection')
  @IsString()
  id: string | number;
}
