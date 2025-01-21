import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Product from 'src/entities/Product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import ProductImage from 'src/entities/ProductImage.entity';
import ProductVariant from 'src/entities/ProductVariant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage, ProductVariant])],
  controllers: [ProductController],
  providers: [ProductService, CloudinaryService],
})
export class ProductModule {}
