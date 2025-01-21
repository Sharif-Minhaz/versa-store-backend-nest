import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class MultipleFilesValidationPipe implements PipeTransform {
  transform(value: Array<Express.Multer.File>, _metadata: ArgumentMetadata) {
    if (!value?.length) {
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

    value.forEach((file) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types are: ${allowedMimeTypes.join(', ')}`,
        );
      }

      if (file.size >= tenMB) {
        throw new BadRequestException(
          `File size too large. Maximum size allowed is ${tenMB / (1024 * 1024)}MB`,
        );
      }
    });

    return value; // Return the actual files if all validations pass
  }
}
