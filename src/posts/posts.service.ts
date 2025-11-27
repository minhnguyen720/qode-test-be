import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        createdBy: createPostDto.createdBy,
        url: createPostDto.url,
        isHidden: createPostDto.isHidden ?? false,
        id: createPostDto.id,
        createdAt: new Date(),
        filename: `upload-file-${createPostDto.id}`,
        comments: undefined,
      },
    });
  }

  async getAllPosts() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPostById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async removePostById(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async updatePostStatusById(updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id: updatePostDto.id },
      data: { isHidden: updatePostDto.isHidden },
    });
  }
}
