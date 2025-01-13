import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, _metadata: ArgumentMetadata) {
    if (!value) {
      return null;
    }

    const tenMB = 10 * 1024 * 1024;
    const allowedMimeTypes = [
      'image/jpg',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(
        `File type not allowed. Allowed types are: ${allowedMimeTypes.join(', ')}`,
      );
    }

    if (value.size >= tenMB) {
      throw new BadRequestException(
        `File size too large. Maximum size allowed is ${tenMB / (1024 * 1024)}MB`,
      );
    }

    return value; // Return the actual file if all validations pass
  }
}
