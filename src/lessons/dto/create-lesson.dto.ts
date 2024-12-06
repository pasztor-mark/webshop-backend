import { IsString, MinLength, MaxLength, IsInt, Min, Max, IsArray, IsDate } from 'class-validator';
import { $Enums } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  title: string;

  @IsString()
  @MinLength(4)
  @MaxLength(255)
  description: string;

  @IsInt()
  @Min(0)
  @Max(500000)
  price: number;

  @IsDate()
  startTime: Date;

  @IsDate()
  endTime: Date;

  @IsInt()
  hostId: number;

  level: $Enums.Level;

  subject: $Enums.Subject;

  @IsArray()
  @IsInt({ each: true })
  participantIds: number[];
}
