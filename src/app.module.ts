import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './@database/database.module';
import { envSchema } from './modules/env/env';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthenticateModule } from './modules/authenticate/authenticate.module';
import { HealthModule } from './modules/health/health.module';
import { ClassificationsModule } from './modules/classifications/classifications.module';
import { EnginesModule } from './modules/engines/engines.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { RequestLoggerMiddleware } from './@shared/middlewares/request-logger.middleware';
import { LoggerModule } from './@shared/modules/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    AuthenticateModule,
    AccountsModule,
    HealthModule,
    ClassificationsModule,
    EnginesModule,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*path'); // Apply to all routes
  }
}
