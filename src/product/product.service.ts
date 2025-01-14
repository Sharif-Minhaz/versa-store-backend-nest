import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/Product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    const products = await this.productRepository.find();

    return { success: true, data: { products } };
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { _id: id },
    });

    if (!product)
      throw new NotFoundException({
        status: false,
        message: 'Product not found',
      });

    return { success: true, product };
  }

  async getPopularProducts() {
    const products = await this.productRepository.find();
    return {
      success: true,
      products,
    };
  }

  getVendorProducts(name: string) {
    return `This action returns products from vendor ${name}`;
  }

  addProduct() {
    return 'This action adds a new product';
  }

  updateProduct() {
    return 'This action updates a #product';
  }

  deleteProduct() {
    return 'This action removes a #product';
  }

  deleteProductImage() {
    return 'This action removes a #product image';
  }

  bookmarkToggleProduct() {
    return 'This action bookmark or unbookmark a #product';
  }

  searchProduct() {
    return 'This action searches for a #product';
  }
}
