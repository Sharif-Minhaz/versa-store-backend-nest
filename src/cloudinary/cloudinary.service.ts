import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Types for the response
interface CloudinaryResponse {
  publicId: string;
  imageUrl: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('cloudinary.cloudName'),
      api_key: this.configService.get('cloudinary.apiKey'),
      api_secret: this.configService.get('cloudinary.apiSecret'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'versaStoreNEST',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            publicId: result.public_id,
            imageUrl: result.secure_url,
          });
        },
      );

      // Convert buffer to Stream
      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }

  // Optional: Method to delete images if needed
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
