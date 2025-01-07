import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(readonly appService: CategoryService) {}

  @Get()
  findAll() {
    return this.appService.getAllCategories();
  }
}
