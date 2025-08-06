import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @IsString({ message: 'Email cannot be null.' })
  @IsEmail({}, { message: 'Email not valid.' })
  email: string;

  @IsString({ message: 'Password cannot be null' })
  @MinLength(13, { message: 'Password minimun character should be 13.' })
  password: string;
}
