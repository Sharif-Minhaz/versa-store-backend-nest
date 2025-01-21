import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { createUserDtoSchema, CreateUserZodDto } from './dto/createUser.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/pipes/FileValidation.pipe';
import { ZodValidationPipe } from 'src/pipes/ZodValidation.pipe';
import { loginUserSchema, LoginUserZodDto } from './dto/loginUser.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { updateUserDtoSchema, UpdateUserZodDto } from './dto/updateUser.dto';
import { FilesValidationPipe } from 'src/pipes/FilesValidation.pipe';
import { LoggedInGuard } from 'src/common/guards/loggedIn.guard';
// import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

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

  @UseGuards(LoggedInGuard)
  @Post('login')
  login(@Body(new ZodValidationPipe(loginUserSchema)) dto: LoginUserZodDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'shopPhoto', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  updateLoggedInUser(
    @UploadedFiles(new FilesValidationPipe())
    files: { shopPhoto: Express.Multer.File[]; image: Express.Multer.File[] },
    @Body(new ZodValidationPipe(updateUserDtoSchema)) dto: UpdateUserZodDto,
  ) {
    return this.authService.updateLoggedInUser(
      dto,
      files?.shopPhoto?.[0],
      files?.image?.[0],
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  refreshToken(@Body() body) {
    return this.authService.refreshTokens(body);
  }

  @UseGuards(LoggedInGuard)
  @Post('google')
  continueWithGoogle(@Body() body) {
    return this.authService.continueWithGoogle(body);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getProfile(req);
  }
}
