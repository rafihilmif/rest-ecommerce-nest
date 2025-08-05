import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/users/dto/register-user.dto';
import { hash } from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async register(userRegisterDto: UserRegisterDto): Promise<UserEntity> {
    const userExist = await this.findUserByEmail(userRegisterDto.email);

    if (userExist) {
      throw new HttpException('Email already taken.', HttpStatus.CONFLICT);
    }

    userRegisterDto.password = await hash(userRegisterDto.password, 10);

    let user = this.usersRepository.create(userRegisterDto);
    user = await this.usersRepository.save(user);
    delete user?.password;
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }
}
