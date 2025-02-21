import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let msg = exception instanceof Error ? exception.message : '';
    if (exception instanceof HttpException) {
      console.log('HTTP exception', exception.getResponse());
      if (typeof exception.getResponse() === 'string') {
        msg = exception.getResponse().toString();
      } else if (exception.getResponse()['message']) {
        msg = exception.getResponse()['message'].toString();
      }
    }

    const requestUrl = httpAdapter.getRequestUrl(ctx.getRequest());

    const responseBody = {
      message: msg,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: requestUrl,
    };
    Logger.error(`${requestUrl}`, JSON.stringify(responseBody), 'Exception');
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
