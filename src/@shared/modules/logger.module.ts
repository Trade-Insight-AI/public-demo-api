import { Global, Module } from '@nestjs/common';
import { CustomLogger, ILogger } from '../classes/custom-logger';
import { EnvModule } from '@/modules/env/env.module';

@Global()
@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: ILogger,
      useClass: CustomLogger,
    },
  ],
  exports: [ILogger],
})
export class LoggerModule {}
