import { Module } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

import { TEnvService } from '@/modules/env/services/env.service';
import {
  TIA_PROVIDER_ENVIRONMENT,
  TIA_PROVIDER_HTTP_CLIENT,
} from './models/tia-provider-metadata.struct';
import {
  ITIAProviderEnvironment,
  TTIAProvider,
} from './models/tia-provider.struct';
import { TIAProvider } from './providers/tia.provider';
import { EnvModule } from '@/modules/env/env.module';

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: TIA_PROVIDER_HTTP_CLIENT,
      useFactory: (envService: TEnvService): AxiosInstance => {
        return axios.create({
          baseURL: envService.get('EXTERNAL_TIA_API'),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      },
      inject: [TEnvService],
    },
    {
      provide: TIA_PROVIDER_ENVIRONMENT,
      useFactory: (envService: TEnvService): ITIAProviderEnvironment => {
        return {
          clientId: envService.get('EXTERNAL_TIA_CLIENT_ID'),
          clientSecret: envService.get('EXTERNAL_TIA_CLIENT_SECRET'),
        };
      },
      inject: [TEnvService],
    },
    {
      provide: TTIAProvider,
      useClass: TIAProvider,
    },
  ],
  exports: [TTIAProvider],
})
export class TIAProviderModule {}
