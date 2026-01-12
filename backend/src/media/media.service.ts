import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import NodeMediaServer from 'node-media-server';
import { StreamsService } from 'src/streams/streams.service';

@Injectable()
export class MediaService implements OnModuleInit, OnModuleDestroy {
  private nms!: NodeMediaServer;

  constructor(
    private prisma: PrismaService,
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
    };

    this.nms = new NodeMediaServer(config);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.nms.on('prePublish', (id: string, streamPath: string) => {
      this.prePublishEvent(id, streamPath).catch((err: unknown) => {
        console.error('[RTMP] prePublish error:', err);
      });
    });

    // this.nms.on('postPublish', (id: string, streamPath: string) => {
    //   console.error('[RTMP] postPublish:', id, streamPath);
    // });

    this.nms.on('donePublish', (id: string, streamPath: string) => {
      this.donePublishEvent(id, streamPath).catch((err: unknown) => {
        console.error('[RTMP] donePublish error:', err);
      });
    });
  }

  private async prePublishEvent(id: string, streamPath: string) {
    // streamPath format: /live/{streamKey}
    const streamKey = streamPath.split('/')[2];

    if (!streamKey) {
      console.log('[RTMP] No stream key, rejecting');

      // We first cast to `unknown` to reset the unsafe type, then assert
      // the minimal session shape we need (`reject()`), allowing a safe call.
      // `undefined` is included since the session may not exist.
      const session = this.nms.getSession(id) as unknown as
        | { reject: () => void }
        | undefined;
      session?.reject();
      return;
    }

    const user = await this.prisma.user.findUnique({
      where: { streamKey },
    });

    if (!user) {
      console.log('[RTMP] Invalid stream key, rejecting');

      // We first cast to `unknown` to reset the unsafe type, then assert
      // the minimal session shape we need (`reject()`), allowing a safe call.
      // `undefined` is included since the session may not exist.
      const session = this.nms.getSession(id) as unknown as
        | { reject: () => void }
        | undefined;
      session?.reject();
      return;
    }

    console.log(`[RTMP] User ${user.username} started streaming`);

    const createStreamPayload = {
      title: `${user.username}'s Stream`,
    };

    await this.streamsService.createStream(user.id, createStreamPayload);
  }

  private async donePublishEvent(id: string, streamPath: string) {
    console.log('[RTMP] donePublish:', streamPath);

    const streamKey = streamPath.split('/')[2];

    const user = await this.prisma.user.findUnique({
      where: { streamKey },
    });

    if (!user) {
      return;
    }

    console.log(`[RTMP] User ${user.username} stopped streaming`);

    // call endStream method of streams service
    await this.streamsService.endAllStream(user?.id);
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
