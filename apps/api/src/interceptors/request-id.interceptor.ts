import { randomUUID } from 'node:crypto';
import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';

const requestIdHeader = 'x-request-id';
const maximumRequestIdLength = 128;

@Injectable()
export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const suppliedRequestId = request.header(requestIdHeader);
    const requestId =
      suppliedRequestId && suppliedRequestId.length <= maximumRequestIdLength
        ? suppliedRequestId
        : `req_${randomUUID()}`;

    response.setHeader(requestIdHeader, requestId);
    return next.handle();
  }
}
