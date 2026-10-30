import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

// Bonus: logs every request with its status code and how long it took
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, originalUrl } = request;
    const start = Date.now();

    return next.handle().pipe(
      tap({
        // Success: the handler returned normally
        next: () => {
          this.logger.log(
            `${method} ${originalUrl} ${response.statusCode} - ${Date.now() - start}ms`,
          );
        },
        // Error: the handler threw (e.g. NotFoundException -> 404)
        error: (err: unknown) => {
          const status = err instanceof HttpException ? err.getStatus() : 500;
          this.logger.warn(
            `${method} ${originalUrl} ${status} - ${Date.now() - start}ms`,
          );
        },
      }),
    );
  }
}
