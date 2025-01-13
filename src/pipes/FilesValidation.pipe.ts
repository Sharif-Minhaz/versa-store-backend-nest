import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, _metadata: ArgumentMetadata) {
    const multipleFiles = Object.entries(value);

    if (!multipleFiles.length) {
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

    multipleFiles.forEach((file) => {
      const image = Object.entries(file)[1]?.[1]?.[0];
      if (!allowedMimeTypes.includes(image?.mimetype)) {
        throw new BadRequestException(
          `File type not allowed. Allowed types are: ${allowedMimeTypes.join(', ')}`,
        );
      }

      if (image.size >= tenMB) {
        throw new BadRequestException(
          `File size too large. Maximum size allowed is ${tenMB / (1024 * 1024)}MB`,
        );
      }
    });

    return value; // Return the actual file if all validations pass
  }
}
