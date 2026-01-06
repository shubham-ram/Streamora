import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { StreamsService } from './streams.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';
import { ZodValidationPipe } from 'zod.validation.pipe';

import {
  createStreamSchema,
  type createStreamDto,
} from 'src/streams/dto/createStream.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('/api/streams')
export class StreamsController {
  constructor(private streamService: StreamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createStream(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(createStreamSchema))
    createStreamPayload: createStreamDto,
  ) {
    return this.streamService.createStream(user.id, createStreamPayload);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllLiveStreams() {
    return this.streamService.getAllLiveStream();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getLiveStream(@Param('id') id: string) {
    return this.streamService.getLiveStream(id);
  }
}
