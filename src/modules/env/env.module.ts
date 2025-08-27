import { Global, Module } from '@nestjs/common';
import { EnvService, TEnvService } from './services/env.service';

@Global()
@Module({
  providers: [
    {
      provide: TEnvService,
      useClass: EnvService,
    },
  ],
  exports: [TEnvService],
})
export class EnvModule {}
