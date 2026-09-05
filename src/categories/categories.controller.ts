import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  @Post()
  create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
   return this.categoriesService.findOne(id);
  }

  @Patch(':id')
   update(
   @Param('id', ParseIntPipe) id: number,
   @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
  return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(
  @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
  return this.categoriesService.remove(id);
 }
}
