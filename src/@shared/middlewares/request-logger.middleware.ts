import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILogger } from '@/@shared/classes/custom-logger';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private logger: ILogger) {
    this.logger.setContextName(RequestLoggerMiddleware.name);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, headers } = req;
    const userAgent = headers['user-agent'] || 'Unknown';
    const startTime = Date.now();

    // Log the incoming request
    this.logger.debug(
      `Incoming Request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    // Log response when it's finished
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      this.logger.debug(
        `Response: ${method} ${originalUrl} - Status: ${statusCode} - Duration: ${duration}ms`,
      );
    });

    next();
  }
}
