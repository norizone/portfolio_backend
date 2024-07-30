import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v7 as uuidv7 } from 'uuid';
import { basename, extname } from 'path';
import * as sharp from 'sharp';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileExtension = extname(file.originalname);

    try {
      // sharpを使用して画像の幅を取得
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      const width = metadata.width;
      const height = metadata.height;
      const webpBuffer = await image.webp({ quality: 80 }).toBuffer();
      const fileNameWithoutExt = basename(file.originalname, fileExtension);

      console.log(fileExtension);
      // ファイルキーに幅情報を含める
      const key = `${uuidv7()}_width:${width}_height:${height}_${fileNameWithoutExt}.webp`;

      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: webpBuffer,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await this.s3.send(command);
      const fileUrl = `https://${this.bucketName}.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${key}`;
      return fileUrl;
    } catch (error) {
      console.error('Error processing image:', error);
      throw new Error('Error processing image');
    }
  }
}
