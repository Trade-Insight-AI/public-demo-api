import { z } from 'zod';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TEnvService } from '@/modules/env/services/env.service';

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type TAccountPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: TEnvService) {
    const publicKey = envService.get('AUTH_JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: TAccountPayload) {
    try {
      return tokenPayloadSchema.parse(payload);
    } catch {
      throw new UnauthorizedException('Invalid token payload');
    }
  }
}
