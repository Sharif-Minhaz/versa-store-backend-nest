import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  createCategoryDtoSchema,
  CreateCategoryZodDto,
} from './dto/createCategory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'src/pipes/ZodValidation.pipe';
import { FileValidationPipe } from 'src/pipes/FileSizeValidation.pipe';

@Controller('categories')
export class CategoryController {
  constructor(readonly appService: CategoryService) {}

  @Get()
  findAll() {
    return this.appService.getAllCategories();
  }

  @Get('/find/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getCategoryById(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(new FileValidationPipe()) image: Express.Multer.File,
    @Body(new ZodValidationPipe(createCategoryDtoSchema))
    dto: CreateCategoryZodDto,
  ) {
    return this.appService.addCategory(image, dto);
  }
}
