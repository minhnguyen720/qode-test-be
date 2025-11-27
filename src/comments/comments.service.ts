import { Injectable } from '@nestjs/common';
import { Comment } from './dto/comment-res.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCmtRequestDto } from './dto/comment-on-post-req.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const result = await this.prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
    });
    return result.map((item) => {
      return {
        id: item.id,
        postId: item.postId,
        content: item.content,
        createdBy: item.createdBy,
        createdAt: item.createdAt,
      };
    });
  }

  async commentOnPost(req: CreateCmtRequestDto): Promise<Comment> {
    const result = await this.prisma.comment.create({
      data: {
        postId: req.postId,
        content: req.content,
        createdBy: req.createdBy,
        createdAt: new Date(),
      },
    });
    return {
      id: result.id,
      postId: result.postId,
      content: result.content,
      createdBy: result.createdBy,
      createdAt: result.createdAt,
    };
  }
}
