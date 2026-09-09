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
import { memoryStorage } from 'multer';

import { v2 as cloudinary } from 'cloudinary';

import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {

  constructor(
    private readonly productsService: ProductsService,
  ) {

    // Configuration Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

  }

  // =========================
  // UPLOAD IMAGE
  // =========================

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),

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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ) {

    if (!file) {
      return {
        message: 'Aucune image envoyée.',
      };
    }

    // Envoi de l'image vers Cloudinary
    const result = await new Promise<any>((resolve, reject) => {

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'sipta/products',
          resource_type: 'image',
        },

        (error, result) => {

          if (error) {
            reject(error);
          } else {
            resolve(result);
          }

        },
      );

      upload.end(file.buffer);
    });

    return {
      message: 'Image uploadée avec succès.',
      image: result.secure_url,
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
