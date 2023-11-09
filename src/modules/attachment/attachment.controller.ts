import { Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFiles, UseInterceptors, SetMetadata } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { Attachment } from './attachment.schema';
import { ApiResponse, Response } from 'src/core/api/api.interface';
import { MongoError } from 'mongodb';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('attachment')
export class AttachmentController {

    constructor(private attachmentService: AttachmentService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    @SetMetadata('isPublic', true)
    async create(
      @UploadedFiles(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({ maxSize: 500000 }),
          ],
        }),
      ) files:  Array<Express.Multer.File>
    ): Promise<ApiResponse<Attachment[] | null>> {
      try {
        const attachments = await this.attachmentService.cloudSave(files);
        return Response.OK(attachments, 'Attachment created successfully');
      } catch (error) {
        return Response.Error(error instanceof MongoError ? error.message : 'Error creating Attachment');
      }
    }

    @Get()
    async findAll(@Query('pageNumber') pageNumber: number, @Query('limit') limit: number): Promise<ApiResponse<Attachment[] | null>> {
      
      try {
        const attachments = await this.attachmentService.findAll({pageNumber, limit});
        return Response.OK(attachments.data, 'Attachments fetched successfully', await attachments.totalCount);
      } catch (error) {
        return Response.Error('Error fetching Attachments');
      }
    }

    
  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Attachment | null>> {
    try {
      const attachment = await this.attachmentService.findById(id);
      return Response.OK(attachment, 'Attachment fetched successfully');
    } catch (error) {
      return Response.Error('Error fetching attachment');
    }
  }

  @Put(':id')
  async updateAttachment(@Param('id') id: string, @Body() attachment: Attachment): Promise<ApiResponse<Attachment | null>> {
    try {
      const updatedAttachment = await this.attachmentService.update(id, attachment);
      return Response.OK(updatedAttachment, 'Attachment updated successfully');
    } catch (error) {
      return Response.Error('Error updating attachment');
    }
  }

  @Delete(':id')
  async deleteAttachment(@Param('id') id: string): Promise<ApiResponse<Attachment | null>> {
    try {
      const deletedAttachment = await this.attachmentService.delete(id);
      return Response.OK(deletedAttachment, 'Attachment deleted successfully');
    } catch (error) {
      return Response.Error('Error deleting attachment');
    }
  }
}
