import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDtoSchema, CreateUserZodDto } from './dto/createUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipes/FileSizeValidation.pipe';
import { ZodValidationPipe } from 'src/pipes/ZodValidation.pipe';
import { loginUserSchema, LoginUserZodDto } from './dto/loginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('shopPhoto'))
  register(
    @UploadedFile(new FileValidationPipe()) shopPhoto: Express.Multer.File,
    @Body(new ZodValidationPipe(createUserDtoSchema))
    dto: CreateUserZodDto,
  ) {
    return this.authService.register(dto, shopPhoto);
  }

  @Post('login')
  login(@Body(new ZodValidationPipe(loginUserSchema)) dto: LoginUserZodDto) {
    return this.authService.login(dto);
  }
}
