import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRegisterDto } from 'src/users/dto/register-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { UserLoginDto } from 'src/users/dto/login-user-dto';
import { CurrentUser } from 'src/util/decorator/current-user.decorator';
import { AuthenticGuard } from '@/src/guard/authentic.guard';
import { AuthorizeGuard } from '@/src/guard/authorize.guard';
import { AuthorizeRole } from '@/src/util/decorator/authorize-role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<{ user: UserEntity }> {
    return { user: await this.usersService.register(userRegisterDto) };
  }

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<{
    accessToken: string;
    user: UserEntity;
  }> {
    const user = await this.usersService.login(userLoginDto);
    const accessToken = await this.usersService.accessToken(user);

    return { accessToken, user };
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @AuthorizeRole('admin')
  @UseGuards(AuthenticGuard, AuthorizeGuard)
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthenticGuard)
  async getProfile(@CurrentUser() currentUser: UserEntity) {
    return currentUser;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
