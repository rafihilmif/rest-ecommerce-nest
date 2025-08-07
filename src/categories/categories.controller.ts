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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenticGuard } from '@/src/guard/authentic.guard';
import { AuthorizeGuard, AuthorizeRole } from '@/src/guard/authorize.guard';
import { CategoryEntity } from '@/src/categories/entities/category.entity';
import { CurrentUser } from '@/src/util/decorator/current-user.decorator';
import { UserEntity } from '@/src/users/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @AuthorizeRole('admin')
  @UseGuards(AuthenticGuard, AuthorizeGuard)
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @AuthorizeRole('admin')
  @UseGuards(AuthenticGuard, AuthorizeGuard)
  @Get()
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoriesService.findAll();
  }

  @AuthorizeRole('admin')
  @UseGuards(AuthenticGuard, AuthorizeGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CategoryEntity> {
    return await this.categoriesService.findOne(+id);
  }

  @AuthorizeRole('admin')
  @UseGuards(AuthenticGuard, AuthorizeGuard)
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<CategoryEntity> {
    return this.categoriesService.remove(+id);
  }
}
