import { IsNotEmpty, IsString } from 'class-validator';
import { UserLoginDto } from 'src/users/dto/login-user-dto';

export class UserRegisterDto extends UserLoginDto {
  @IsNotEmpty({ message: 'Name cannot be null.' })
  @IsString({ message: 'Name should be string.' })
  name: string;
}
