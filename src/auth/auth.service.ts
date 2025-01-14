import * as argon2 from 'argon2';
import {
  BadRequestException,
  Body,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserZodDto } from './dto/createUser.dto';
import Vendor from 'src/entities/Vendor.entity';
import Customer from 'src/entities/Customer.entity';
import Admin from 'src/entities/Admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { LoginUserZodDto } from './dto/loginUser.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserZodDto } from './dto/updateUser.dto';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    @Inject(REQUEST) private readonly request,
    @InjectRepository(Vendor) private vendorRepository: Repository<Vendor>,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: CreateUserZodDto, shopPhoto?: Express.Multer.File) {
    const hashedPassword = await argon2.hash(dto.password);

    let user = null;

    if (dto?.registerFor === 'vendor') {
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

    const tokens = await this.getTokens({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
      user_type: user.user_type,
    });

    return {
      message: 'User registered successfully',
      success: true,
      user,
      tokens,
    };
  }
  async login(dto: LoginUserZodDto) {
    let user: any;

    switch (dto.loginFor) {
      case 'vendor':
        user = await this.vendorRepository.findOne({
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
        });
        break;
      case 'admin':
        user = await this.adminRepository.findOne({
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
        });
        break;
      case 'customer':
        user = await this.customerRepository.findOne({
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
        break;

      default:
        throw new BadRequestException({
          status: false,
          message: 'User type not supported',
        });
    }

    if (!user) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid Credentials',
      });
    }

    const isPasswordValid = await argon2.verify(user.password, dto.password);

    if (!isPasswordValid) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid Credentials',
      });
    }

    delete user.password;

    const tokens = await this.getTokens({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      image: user.image,
      user_type: user.user_type,
    });

    return {
      message: 'User logged in successfully',
      success: true,
      user,
      tokens,
    };
  }

  async getTokens({
    _id,
    fullName,
    image,
    email,
    user_type,
  }: {
    _id: number;
    fullName: string;
    image: string;
    email: string;
    user_type: string;
  }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          _id,
          fullName,
          image,
          email,
          user_type,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        {
          _id,
          fullName,
          image,
          email,
          user_type,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateLoggedInUser(
    dto: UpdateUserZodDto,
    shopPhoto?: Express.Multer.File,
    image?: Express.Multer.File,
  ) {
    const user = this.request?.user;

    if (!user) {
      throw new UnauthorizedException({
        status: false,
        message: 'User is not authenticated',
      });
    }

    let userInfo = {};

    // update users based on user_type
    switch (user.user_type) {
      case 'vendor':
        const vendorUser = await this.vendorRepository.findOne({
          where: { email: user.email, _id: user._id },
        });

        // default images
        let shop_photo = {
          publicId: vendorUser.shopPhotoKey || '',
          imageUrl: vendorUser.shopPhoto || '',
        };
        let vendor_image = {
          publicId: vendorUser.imageKey || '',
          imageUrl: vendorUser.image || '',
        };

        // shop image upload to cloudinary
        if (shopPhoto) {
          shop_photo = await this.cloudinaryService.uploadImage(shopPhoto);
        }

        // profile image upload to cloudinary
        if (image) {
          vendor_image = await this.cloudinaryService.uploadImage(image);
        }

        // user update
        userInfo = await this.vendorRepository.update(
          { _id: user._id },
          {
            ...dto,
            shopPhoto: shop_photo.imageUrl,
            shopPhotoKey: shop_photo.publicId,
            image: vendor_image.imageUrl,
            imageKey: vendor_image.publicId,
          },
        );
        break;
      case 'admin':
        const adminUser = await this.adminRepository.findOne({
          where: { email: user.email, _id: user._id },
        });

        let admin_image = {
          publicId: adminUser.imageKey || '',
          imageUrl: adminUser.image || '',
        };

        // image upload to cloudinary
        if (image) {
          admin_image = await this.cloudinaryService.uploadImage(image);
        }

        // user update
        userInfo = await this.adminRepository.update(
          { _id: user._id },
          {
            ...dto,
            image: admin_image.imageUrl,
            imageKey: admin_image.publicId,
          },
        );

        break;
      default:
        const customerUser = await this.customerRepository.findOne({
          where: { email: user.email, _id: user._id },
        });

        let profile_image = {
          publicId: customerUser.imageKey || '',
          imageUrl: customerUser.image || '',
        };

        // image upload to cloudinary
        if (image) {
          profile_image = await this.cloudinaryService.uploadImage(image);
        }

        // user update
        userInfo = await this.customerRepository.update(
          { _id: user._id },
          {
            ...dto,
            image: profile_image.imageUrl,
            imageKey: profile_image.publicId,
          },
        );

        break;
    }

    if (!userInfo) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }

    return {
      success: true,
      message: 'User updated successfully',
      user: dto,
    };
  }

  async refreshTokens(@Body() body: { refreshToken: string }) {
    const decoded = this.jwtService.verify(body.refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    if (!decoded) {
      throw new ForbiddenException({
        status: false,
        message: 'Access denied, invalid token',
      });
    }

    const admin = decoded.user_type === 'admin';
    const vendor = decoded.user_type === 'vendor';
    const customer = decoded.user_type === 'customer';

    let user;

    // registration based on role
    if (admin) {
      user = await this.adminRepository.findOne({
        where: { _id: decoded._id },
      });
    } else if (vendor) {
      // for vendor type user
      // update the vendor user
      user = await this.vendorRepository.findOne({
        where: { _id: decoded._id },
      });
    } else if (customer) {
      // update admin
      user = await this.customerRepository.findOne({
        where: { _id: decoded._id },
      });
    }

    if (!user) {
      throw new NotFoundException({
        status: false,
        message: 'User not found',
      });
    }

    const tokens = await this.getTokens(user);
    return tokens;
  }

  async continueWithGoogle(body) {
    const user = await this.customerRepository.findOne({
      where: { email: body.email },
    });

    if (user?.loginMethod === 'form') {
      throw new ConflictException({
        success: false,
        message: 'User already registered with password',
      });
    }

    if (user?.loginMethod === 'google') {
      throw new ConflictException({
        success: false,
        message: 'User already registered with google',
      });
    }

    const newUser = await this.customerRepository.save({
      email: body.email,
      fullName: body.name,
      image: body.picture,
      loginMethod: 'google',
      user_type: 'customer',
    });

    delete newUser.password;

    const tokens = await this.getTokens(newUser);
    return { tokens, user: newUser };
  }

  async getProfile(req) {
    const user = req.user;

    return {
      success: true,
      profile: { ...user },
    };
  }
}
