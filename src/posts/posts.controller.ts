import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any, @Body() body: any) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const id = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${id}${ext}`;
    const filePath = path.resolve(uploadDir, filename);
    console.log(filePath);
    fs.writeFileSync(filePath, file.buffer);
    const createPostDto: CreatePostDto = {
      createdBy: 'admin',
      url: filePath,
      isHidden: false,
      id,
    };
    return this.postsService.create(createPostDto);
  }

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string, @Res() res: Response) {
    const post = await this.postsService.getPostById(id);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    const filePath = post.url; // Absolute path
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }
    res.sendFile(filePath);
  }

  @Delete(':id')
  removePostById(@Param('id') id: string) {
    return this.postsService.removePostById(id);
  }

  @Post('update-status')
  updatePostStatusById(@Request() req: UpdatePostDto) {
    return this.postsService.updatePostStatusById(req);
  }
}
