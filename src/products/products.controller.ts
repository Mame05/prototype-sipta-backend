import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {}

  // =========================
  // UPLOAD IMAGE
  // =========================

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',

        filename: (req, file, callback) => {

          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extname(file.originalname)}`;

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (req, file, callback) => {

        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new Error('Seules les images sont autorisées.'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) {
      return {
        message: 'Aucune image envoyée.',
      };
    }

    return {
      message: 'Image uploadée avec succès.',
      image: file.filename,
    };
  }


  // =========================
  // CRÉER
  // =========================

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(createProductDto);
  }


  // =========================
  // LISTE
  // =========================

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }


  // =========================
  // DÉTAIL
  // =========================

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return this.productsService.findOne(id);
  }


  // =========================
  // MODIFIER
  // =========================

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(id, updateProductDto);
  }


  // =========================
  // SUPPRIMER
  // =========================

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.productsService.remove(id);
  }
}

