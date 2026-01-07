import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { StreamsService } from './streams.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { type User } from '@prisma/client';
import { ZodValidationPipe } from 'zod.validation.pipe';

import {
  createStreamSchema,
  type createStreamDto,
} from 'src/streams/dto/createStream.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  updateStreamSchema,
  type UpdateStreamDto,
} from './dto/updateStream.dto';

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
  getAllLiveStreams() {
    return this.streamService.getAllLiveStream();
  }

  @Get('/user/:username')
  getUserStream(@Param('username') username: string) {
    return this.streamService.getUserStream(username);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getLiveStream(@Param('id') id: string) {
    return this.streamService.getLiveStream(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateStream(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(updateStreamSchema))
    updateStreamPayload: UpdateStreamDto,
  ) {
    return this.streamService.updateStream(id, user.id, updateStreamPayload);
  }

  @Post(':id/end')
  @UseGuards(JwtAuthGuard)
  endStream(@Param('id') id: string, @CurrentUser() user: User) {
    return this.streamService.endStream(id, user.id);
  }
}
