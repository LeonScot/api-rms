// attachment.model.ts
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attachment } from './attachment.schema';
import { CrudService } from 'src/core/api/crud.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AttachmentService extends CrudService<Attachment> {

  public query: object;

  constructor(@InjectModel(Attachment.name) private readonly attachmentModel: Model<Attachment>) {
      super(attachmentModel);
  }

  async saveFiles(files: { originalname: string, buffer: string | NodeJS.ArrayBufferView, mimetype : string}[]): Promise<Attachment[]> {
    const uploadPaths: string[] = [];
    const attachments: Attachment[] = [];
    
    await Promise.all(files.map(async (file) => {
      // Create a unique filename using UUID
      const uniqueFilename = uuidv4();
      const fileExtension = path.extname(file.originalname);
      const filename = `${file.originalname}_${uniqueFilename}${fileExtension}`;

      // Define the upload path on the server
      const uploadPath = path.join('uploads', filename);

      await new Promise((resolve, reject) => {
        // Save the file to the server
        fs.writeFile(uploadPath, file.buffer, async (error) => {
          if (error) {
            reject(error);
          } else {
            uploadPaths.push(uploadPath);

            const attachment = await this.create({
              name: filename,
              type: file.mimetype,
              url: `${process.env.BASE_URL}\\${uploadPath}`
            });
            attachments.push(attachment);

            resolve(uploadPaths);
          }
        });
      });
      
    }));
    
    return attachments;
  }
}
