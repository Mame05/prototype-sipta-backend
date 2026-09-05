import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepository.findOne({
      where: {
        id: createProductDto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      category,
    });

    return this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async findOne(id: number): Promise<Product> {
  const product = await this.productRepository.findOne({
    where: { id },
    relations: {
      category: true,
    },
  });

  if (!product) {
    throw new NotFoundException('Produit introuvable');
  }

  return product;
}

async update(
  id: number,
  updateProductDto: UpdateProductDto,
): Promise<Product> {
  const product = await this.findOne(id);

  if (updateProductDto.categoryId) {
    const category = await this.categoryRepository.findOne({
      where: {
        id: updateProductDto.categoryId,
      },
    });

    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    product.category = category;
    product.categoryId = category.id;
  }

  Object.assign(product, updateProductDto);

  return this.productRepository.save(product);
}

async remove(id: number): Promise<void> {
  const product = await this.findOne(id);

  await this.productRepository.remove(product);
}
}
