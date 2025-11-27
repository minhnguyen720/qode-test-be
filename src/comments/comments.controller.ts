import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCmtRequestDto } from './dto/comment-on-post-req.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @Post()
  commentOnPost(@Body() req: CreateCmtRequestDto) {
    return this.commentsService.commentOnPost(req);
  }
}
