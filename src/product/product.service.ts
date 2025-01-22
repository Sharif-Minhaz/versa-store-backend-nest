import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Product from 'src/entities/Product.entity';
import { Repository } from 'typeorm';
import { CreateProductZodDto } from './dto/createProduct.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { REQUEST } from '@nestjs/core';
import ProductImage from 'src/entities/ProductImage.entity';
import ProductVariant from 'src/entities/ProductVariant.entity';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  constructor(
    @Inject(REQUEST) private readonly request: any,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private productImageRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async addProduct(
    dto: CreateProductZodDto,
    files: Array<Express.Multer.File>,
  ) {
    const queryRunner =
      this.productRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.request?.user;
      if (!files.length) {
        throw new BadRequestException({
          status: false,
          message: 'Product image not found',
        });
      }
      const parsedProductVariant = JSON.parse(dto.variant);
      const productData = {
        name: dto.name,
        price: dto.price,
        description: dto.description,
        discount: dto.discount,
        brand: dto.brand,
        stock: dto.stock,
        sold: dto.sold,
        defaultType: dto.defaultType,
        deliveryCharge: dto.deliveryCharge,
        addedBy: { _id: user._id },
        category: { _id: dto.category },
      };
      const product = await queryRunner.manager.save(
        this.productRepository.create(productData),
      );

      const uploadFile = async (file: Express.Multer.File) => {
        try {
          const { publicId, imageUrl } =
            await this.cloudinaryService.uploadImage(file);
          return { publicId, imageUrl };
        } catch (error) {
          console.error(`Failed to upload file: ${file.originalname}`, error);
          throw new Error(`Upload failed for file: ${file.originalname}`);
        }
      };

      const images = await Promise.all(files.map(uploadFile));
      const productImages = await Promise.all(
        images.map(async (image) => {
          const newImage = this.productImageRepository.create({
            image: image.imageUrl,
            imageKey: image.publicId,
            product: { _id: product._id },
          });
          return queryRunner.manager.save(newImage);
        }),
      );

      const productVariant = await Promise.all(
        parsedProductVariant.map(async (variant) => {
          const newVariant = this.productVariantRepository.create({
            ...variant,
            product: 0,
          });
          return queryRunner.manager.save(newVariant);
        }),
      );

      await queryRunner.commitTransaction();
      return {
        success: true,
        message: 'Product added successfully',
        product: {
          ...product,
          images: productImages,
          variant: productVariant,
        },
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAllProducts({ page, limit, category }) {
    let where: any = {};
    if (category) {
      where = {
        category: {
          _id: category,
        },
      };
    }

    const products = await this.productRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where,
    });

    return { success: true, data: { products } };
  }

  async getProductById(id: number) {
    const product = await this.productRepository.findOne({
      where: { _id: id },
    });

    if (!product)
      throw new NotFoundException({
        success: false,
        message: 'Product not found',
      });

    return { success: true, product };
  }

  async getPopularProducts() {
    const products = await this.productRepository.find({
      order: { sold: 'DESC' },
    });

    return {
      success: true,
      products,
    };
  }

  async getVendorProducts(id: number) {
    const products = await this.productRepository.find({
      where: {
        addedBy: {
          _id: id,
        },
      },
    });

    return { success: true, products };
  }

  async updateProduct() {
    return 'This action updates a #product';
  }

  async deleteProduct(id: number) {
    await this.productRepository.delete(id);
    return { success: true, message: 'Product deleted successfully' };
  }

  async deleteProductImage() {
    return 'This action removes a #product image';
  }

  async bookmarkToggleProduct() {
    return 'This action bookmark or unbookmark a #product';
  }

  async searchProduct(term: string) {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where(`product.search_vector @@ to_tsquery('english', :query)`, {
        query: term.split(' ').join(' & '), // Convert term to tsquery format
      })
      .orderBy(
        "ts_rank(product.search_vector, to_tsquery('english', :query))",
        'DESC',
      )
      .setParameters({ query: term.split(' ').join(' & ') })
      .take(10);

    const products = await query.getMany();

    return { success: true, products };
  }
}
