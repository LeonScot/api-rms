// attachment.model.ts
import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attachment } from './attachment.schema';
import { CrudService } from 'src/core/api/crud.service';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import * as admin from 'firebase-admin';

@Injectable()
export class AttachmentService extends CrudService<Attachment> {

  public query: object;

  constructor(
    @InjectModel(Attachment.name) private readonly attachmentModel: Model<Attachment>,
    @Inject('FirebaseAdmin') private readonly firebaseAdmin: admin.app.App
  ) {
      super(attachmentModel);
  }

  async cloudSave(files: Express.Multer.File[]): Promise<Attachment[]>  {
    const attachments: Attachment[] = [];

    const bucket = this.firebaseAdmin.storage().bucket();

    await Promise.all(files.map(async (file) => {
      
      const uniqueFilename = `${Date.now()}_${file.originalname}`;

      const fileObj = bucket.file(uniqueFilename);

      const fileBuffer = Buffer.from(file.buffer)

      await new Promise(async (resolve, reject) => {
        // Save the file to the server
        await fileObj.save(fileBuffer, {
          contentType: file.mimetype,
        });
        
        fileObj.makePublic();

        const publicUrl = fileObj.publicUrl()

        if (publicUrl) {
          const attachment = await this.create({
            name: uniqueFilename,
            type: file.mimetype,
            url: fileObj.publicUrl()
          });
          attachments.push(attachment);
          resolve(attachment);
        } else {
          reject('error uploading file on cloud storage');
        }
        
      });
    }));
    return attachments;
  }

  async saveFilesOnServer(files: Express.Multer.File[]): Promise<Attachment[]> {
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

  async findByUrl(url : string) {
    const attachment = await this.findOneByQuery({url});
    return attachment;
  }
}
