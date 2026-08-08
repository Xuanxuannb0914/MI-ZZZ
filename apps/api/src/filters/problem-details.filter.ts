import { randomUUID } from 'node:crypto';
import { type ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ProblemDetails {
  readonly type: string;
  readonly title: string;
  readonly status: number;
  readonly code: string;
  readonly detail: string;
  readonly instance: string;
  readonly requestId: string;
}

@Catch()
export class ProblemDetailsFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const requestId = response.getHeader('x-request-id')?.toString() ?? `req_${randomUUID()}`;
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const isInternalServerError = status === Number(HttpStatus.INTERNAL_SERVER_ERROR);

    if (!(exception instanceof HttpException)) {
      const trace = exception instanceof Error ? exception.stack : undefined;
      this.logger.error('Unhandled API exception', trace);
    }

    const problem: ProblemDetails = {
      type: `https://docs.game-guide-hub.invalid/problems/${status}`,
      title: isInternalServerError ? 'Internal server error' : 'Request failed',
      status,
      code: isInternalServerError ? 'INTERNAL_ERROR' : 'REQUEST_FAILED',
      detail: isInternalServerError
        ? 'The request could not be completed. Use the request ID when contacting support.'
        : 'The request could not be completed with the supplied input.',
      instance: request.originalUrl,
      requestId,
    };

    response.status(status).type('application/problem+json').json(problem);
  }
}
