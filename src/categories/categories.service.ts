import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from '@/src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<CategoryEntity> {
    const newCategories = this.categoryRepository.create(createCategoryDto);
    newCategories.added_by = currentUser;

    return await this.categoryRepository.save(newCategories);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const categories = await this.categoryRepository.findOneBy({ id });

    if (!categories) {
      throw new HttpException('Categories not found!', HttpStatus.NOT_FOUND);
    }
    return categories;
  }

  async update(
    id: number,
    fields: Partial<UpdateCategoryDto>,
  ): Promise<CategoryEntity> {
    const categories = await this.findOne(id);
    if (!categories) {
      throw new HttpException('Categories not found!', HttpStatus.NOT_FOUND);
    }
    Object.assign(categories, fields);

    return await this.categoryRepository.save(categories);
  }

  async remove(id: number): Promise<CategoryEntity> {
    const categories = await this.findOne(id);

    if (!categories) {
      throw new HttpException('Categories not found!', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.delete(categories.id);

    return categories;
  }
}
