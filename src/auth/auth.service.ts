import * as argon2 from 'argon2';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserZodDto } from './dto/createUser.dto';
import Vendor from 'src/entities/Vendor.entity';
import Customer from 'src/entities/Customer.entity';
import Admin from 'src/entities/Admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { LoginUserZodDto } from './dto/loginUser.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async register(dto: CreateUserZodDto, shopPhoto?: Express.Multer.File) {
    const hashedPassword = await argon2.hash(dto.password);

    let user = null;

    if (dto.registerFor === 'vendor') {
      if (!shopPhoto) {
        throw new BadRequestException({
          status: false,
          message: 'Shop photo is required',
        });
      }
      // Upload to Cloudinary using the utility function
      const { publicId, imageUrl } =
        await this.cloudinaryService.uploadImage(shopPhoto);
      // try to save category
      user = await this.vendorRepository.save({
        ...dto,
        password: hashedPassword,
        shopPhoto: imageUrl,
        shopPhotoKey: publicId,
      });
    } else if (dto.registerFor === 'admin') {
      user = await this.adminRepository.save({
        ...dto,
        password: hashedPassword,
      });
    } else {
      user = await this.customerRepository.save({
        ...dto,
        password: hashedPassword,
      });
    }

    if (!user) {
      throw new BadRequestException({
        status: false,
        message: 'User registration failed',
      });
    }

    delete user.password;

    return {
      message: 'User registered successfully',
      success: true,
      user,
    };
  }

  async login(dto: LoginUserZodDto) {
    const user =
      dto.loginFor === 'vendor'
        ? await this.vendorRepository.findOne({
            where: { email: dto.email },
            select: {
              _id: true,
              shopPhoto: true,
              shopPhotoKey: true,
              shopName: true,
              shopLicenseNo: true,
              shopType: true,
              fullName: true,
              email: true,
              password: true,
              phone: true,
              image: true,
              imageKey: true,
              user_type: true,
              isBan: true,
              createdAt: true,
              updatedAt: true,
            },
          })
        : dto.loginFor === 'admin'
          ? await this.adminRepository.findOne({
              where: { email: dto.email },
              select: {
                fullName: true,
                email: true,
                password: true,
                phone: true,
                image: true,
                imageKey: true,
                user_type: true,
              },
            })
          : await this.customerRepository.findOne({
              where: { email: dto.email },
              select: {
                fullName: true,
                email: true,
                password: true,
                phone: true,
                image: true,
                imageKey: true,
                user_type: true,
                isBan: true,
                createdAt: true,
                updatedAt: true,
              },
            });

    if (!user) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid Credentials',
      });
    }

    console.log(user);

    const isPasswordValid = await argon2.verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid Credentials',
      });
    }

    delete user.password;

    return {
      message: 'User logged in successfully',
      success: true,
      user,
    };
  }
}
