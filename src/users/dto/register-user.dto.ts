import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserRegister {
  @IsNotEmpty({ message: 'Name cannot be null.' })
  @IsString({ message: 'Name should be string.' })
  name: string;

  @IsString({ message: 'Email cannot be null.' })
  @IsEmail({}, { message: 'Email not valid.' })
  email: string;

  @IsString({ message: 'Password cannot be null' })
  @MinLength(13, { message: 'Password minimun character should be 5.' })
  password: string;
}
