import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import NodeMediaServer from 'node-media-server';
import * as path from 'path';
import { StreamsService } from 'src/streams/streams.service';

@Injectable()
export class MediaService implements OnModuleInit, OnModuleDestroy {
  private nms!: NodeMediaServer;

  constructor(
    private primsa: PrismaService,
    private streamsService: StreamsService,
  ) {
    const config = {
      rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
      },
      http: {
        port: 8000,
        allow_origin: '*',
        mediaroot: path.resolve(process.cwd(), 'media'),
      },
    };

    this.nms = new NodeMediaServer(config);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {}

  private async prePublishEvent(id: string, streamPath: string, args: any) {
    console.log('[RTMP] prePublish:', streamPath);

    // streamPath format: /live/{streamKey}
    const streamKey = streamPath.split('/')[2];

    if (!streamKey) {
      console.log('[RTMP] No stream key, rejecting');
      const session = this.nms.getSession(id);
      session?.reject();
      return;
    }

    const user = await this.primsa.user.findUnique({
      where: { streamKey },
    });

    if (!user) {
      console.log('[RTMP] Invalid stream key, rejecting');
      const session = this.nms.getSession(id);
      session?.reject();
      return;
    }

    console.log(`[RTMP] User ${user.username} started streaming`);

    const createStreamPayload = {
      title: `${user.username}'s Stream`,
    };

    await this.streamsService.createStream(user.id, createStreamPayload);
  }

  private async donePublishEvent(id: string, streamPath: string, args: any) {
    console.log('[RTMP] donePublish:', streamPath);

    const streamKey = streamPath.split('/')[2];

    const user = await this.primsa.user.findUnique({
      where: { streamKey },
    });

    if (!user) {
      return;
    }

    console.log(`[RTMP] User ${user.username} stopped streaming`);

    // call endStream method of streams service
  }

  onModuleInit() {
    this.nms.run();
    console.log('🎬 Media Server running on rtmp://localhost:1935/live');
  }
  onModuleDestroy() {
    this.nms.stop();
    console.log('🎬 Media Server stopped');
  }
}
