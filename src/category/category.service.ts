import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Category from 'src/entities/Category.entity';
import { ILike, Repository } from 'typeorm';
import { CreateCategoryZodDto } from './dto/createCategory.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // get all categories from database
  async getAllCategories() {
    const categories = await this.categoryRepository.find();

    return {
      success: true,
      categories,
    };
  }

  // get category by id from database
  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({
      where: {
        _id: id,
      },
    });

    if (!category)
      throw new NotFoundException({
        success: false,
        message: 'Category not found',
      });

    return {
      success: true,
      category,
    };
  }

  // add category to database and upload image
  async addCategory(image: Express.Multer.File, dto: CreateCategoryZodDto) {
    const isCategoryExist = await this.categoryRepository.findOne({
      where: { name: ILike(dto.name) },
    });

    if (isCategoryExist) {
      throw new ConflictException({
        success: false,
        message: 'Category already exist',
      });
    }

    if (!image)
      throw new BadRequestException({
        success: false,
        message: 'Image is required',
      });

    // Upload to Cloudinary using the utility function
    const { publicId, imageUrl } =
      await this.cloudinaryService.uploadImage(image);

    // try to save category
    const newCategory = await this.categoryRepository.save({
      ...dto,
      image: imageUrl,
      imageKey: publicId,
    });

    if (!newCategory)
      throw new HttpException(
        {
          success: false,
          message: 'Category not created',
        },
        400,
      );

    return {
      success: true,
      category: newCategory,
    };
  }
}
