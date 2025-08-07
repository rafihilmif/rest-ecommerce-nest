import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'name cannot be empty.' })
  @IsString({ message: 'name should be string.' })
  name: string;

  @IsString({ message: 'description should be string.' })
  description: string;
}
