import { IsInt, IsString, Max, MaxLength, Min, MinLength, IsDate } from 'class-validator'
import { $Enums } from '@prisma/client';

enum Level {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
  Expert = 'Expert',
}
enum Subject {
  Maths = 'Maths',
  English = 'English',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Compsci = 'Compsci',
  Foreign = 'Foreign Languages',
  History = 'History',
  Economics = 'Economics',
  Art = 'Art',
}
export class CreateGuideDto {
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

  subject: $Enums.Subject;

  level: $Enums.Level;

  @IsInt()
  authorId: number;
}
