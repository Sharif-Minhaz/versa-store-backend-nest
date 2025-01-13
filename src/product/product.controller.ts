import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('single/:id')
  getProductById(id: string) {
    return this.productService.getProductById(id);
  }

  @Get('popular')
  getProductsByCategory(id: string) {
    return this.productService.getProductsByCategory(id);
  }

  @Get('vendor')
  getVendorProducts(name: string) {
    return this.productService.getVendorProducts(name);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  addProduct() {
    return this.productService.addProduct();
  }

  @Patch(':id')
  updateProduct() {
    return this.productService.updateProduct();
  }

  @Delete(':id')
  deleteProduct() {
    return this.productService.deleteProduct();
  }

  @Delete(':id/images/:imageId')
  deleteProductImage() {
    return this.productService.deleteProductImage();
  }

  @Patch('bookmark/:id')
  bookmarkToggleProduct() {
    return this.productService.bookmarkToggleProduct();
  }

  @Get('search')
  searchProduct() {
    return this.productService.searchProduct();
  }
}
