import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TEnvironment } from '../env';

export abstract class TEnvService {
  abstract get<T extends keyof TEnvironment>(key: T): TEnvironment[T];
}

@Injectable()
export class EnvService implements TEnvService {
  constructor(private configService: ConfigService<TEnvironment, true>) {}

  get<T extends keyof TEnvironment>(key: T) {
    return this.configService.get(key, { infer: true });
  }
}
