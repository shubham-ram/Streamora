import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

/**
 * PrismaService - Database Connection Service
 *
 * This service handles the connection to our PostgreSQL database using Prisma.
 *
 * KEY CONCEPTS FOR LEARNING:
 *
 * 1. @Injectable() - This decorator tells NestJS that this class can be
 *    "injected" into other classes. This is called Dependency Injection (DI).
 *    Instead of creating `new PrismaService()` everywhere, NestJS manages
 *    a single instance and provides it where needed.
 *
 * 2. OnModuleInit - A lifecycle hook that runs when the module is initialized.
 *    We use it to connect to the database when the app starts.
 *
 * 3. OnModuleDestroy - A lifecycle hook that runs when the app is shutting down.
 *    We use it to cleanly disconnect from the database.
 *
 * 4. extends PrismaClient - Our service IS a PrismaClient, so anywhere you
 *    inject this service, you can use all Prisma methods like:
 *    - this.prisma.user.findMany()
 *    - this.prisma.stream.create()
 *    etc.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Called when the NestJS module initializes
   * Establishes connection to PostgreSQL database
   */
  async onModuleInit() {
    await this.$connect();
    console.log('📦 Database connected successfully');
  }

  /**
   * Called when the application is shutting down
   * Cleanly disconnects from the database
   */
  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📦 Database disconnected');
  }
}
