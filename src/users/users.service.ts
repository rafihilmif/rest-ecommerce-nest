import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from 'src/users/dto/register-user.dto';
import { hash, compare } from 'bcrypt';
import { UserLoginDto } from 'src/users/dto/login-user-dto';
import { sign } from 'jsonwebtoken';

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

  async login(userLoginDto: UserLoginDto) {
    const userExist = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email', { email: userLoginDto.email })
      .getOne();

    if (!userExist) {
      throw new HttpException('Email not found.', HttpStatus.NOT_FOUND);
    }

    const matchPassword = await compare(
      userLoginDto.password,
      userExist.password,
    );
    if (!matchPassword) {
      throw new HttpException('Password incorrect.', HttpStatus.BAD_REQUEST);
    }
    delete userExist.password;
    return userExist;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
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

  async accessToken(user: UserEntity): Promise<string> {
    const jwtSecret = process.env.JWT_KEY_ACCESS;

    if (!jwtSecret) {
      throw new Error('JWT_KEY_ACCESS environment variable is not defined');
    }

    return sign(
      {
        id: user.id,
        email: user.email,
      },
      jwtSecret,
      { expiresIn: '30m' },
    );
  }
}
