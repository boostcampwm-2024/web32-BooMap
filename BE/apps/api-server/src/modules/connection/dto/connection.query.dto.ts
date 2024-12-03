import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';

export class ConnectionQueryDto {
  @IsString()
  @IsIn(['mindmap', 'connection'])
  type: string;

  @Transform(({ value, obj }) => {
    return obj.type === 'mindmap' ? Number(value) : value;
  })
  @IsString()
  id: string | number;
}
