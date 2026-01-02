import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
/**
 * CurrentUser Decorator
 *
 * Extracts the user from request (set by JwtStrategy)
 *
 * Usage in controller:
 *   @Get('me')
 *   getMe(@CurrentUser() user: User) {
 *     return user;
 *   }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user;
  },
);
