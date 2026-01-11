import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { StreamsModule } from 'src/streams/streams.module';

@Module({
  providers: [MediaService],
  imports: [StreamsModule],
})
export class MediaModule {}
