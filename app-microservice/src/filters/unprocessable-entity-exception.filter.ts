import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    if (typeof response === 'object') {
      const errors = exceptionResponse as {
        error: string;
        message: ValidationError[];
      };

      response.status(status).json({
        statusCode: status,
        message: errors.error,
        errors: errors.message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
