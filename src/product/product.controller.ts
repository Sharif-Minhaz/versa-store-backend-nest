import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { ZodValidationPipe } from 'src/pipes/ZodValidation.pipe';
import {
  createProductSchema,
  CreateProductZodDto,
} from './dto/createProduct.dto';
import { MultipleFilesValidationPipe } from 'src/pipes/MultipleFilesValidation.pipe';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IsVendorGuard } from 'src/common/guards/isVendor.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAllProducts(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('category') category = 0,
  ) {
    return this.productService.getAllProducts({ page, limit, category });
  }

  @Get('single/:id')
  getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }

  @Get('popular')
  getPopularProducts() {
    return this.productService.getPopularProducts();
  }

  @Get('vendor')
  getVendorProducts(id: number) {
    return this.productService.getVendorProducts(id);
  }

  @UseGuards(AccessTokenGuard, IsVendorGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  addProduct(
    @UploadedFiles(new MultipleFilesValidationPipe())
    images: Array<Express.Multer.File>,
    @Body(new ZodValidationPipe(createProductSchema))
    dto: CreateProductZodDto,
  ) {
    return this.productService.addProduct(dto, images);
  }

  @Patch(':id')
  updateProduct() {
    return this.productService.updateProduct();
  }

  @Delete(':id')
  deleteProduct(id: number) {
    return this.productService.deleteProduct(id);
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
  searchProduct(@Query('term') term: string) {
    return this.productService.searchProduct(term);
  }
}
