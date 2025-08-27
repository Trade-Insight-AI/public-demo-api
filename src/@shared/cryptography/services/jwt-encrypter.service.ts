import { TEnvService } from '@/modules/env/services/env.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export abstract class TJWTEncrypter {
  abstract accessToken(payload: Record<string, any>): Promise<string>;
  abstract refreshToken(payload: Record<string, any>): Promise<string>;
}

@Injectable()
export class JwtEncrypter implements TJWTEncrypter {
  constructor(
    private jwtService: JwtService,
    private envService: TEnvService,
  ) {}

  async accessToken({ sub, ...payload }: Record<string, any>): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.envService.get('AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN'),
      subject: sub as string | undefined,
    });
  }

  async refreshToken({
    sub,
    ...payload
  }: Record<string, any>): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.envService.get('AUTH_JWT_REFRESH_TOKEN_EXPIRES_IN'),
      subject: sub as string | undefined,
    });
  }
}
