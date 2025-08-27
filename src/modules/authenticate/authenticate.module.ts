import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';

import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { EnvModule } from '../env/env.module';
import { TEnvService } from '../env/services/env.service';
import { CryptographyModule } from '@/@shared/cryptography/cryptography.module';
import {
  GetCurrentUserService,
  TGetCurrentUserService,
} from './services/get-current-user.service';

import { SignUpController } from './controllers/sign-up.controller';
import { TSignUpService, SignUpService } from './services/sign-up.service';
import { AccountsModule } from '../accounts/accounts.module';
import { LoginController } from './controllers/login.controller';
import { TLoginService, LoginService } from './services/login.service';
import {
  GenerateTokensService,
  TGenerateTokensService,
} from './services/generate-tokens.service';
import { JwtAuthenticateGuard } from './strategies/jwt/jwt-authenticate.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [TEnvService],
      useFactory: (envService: TEnvService) => ({
        privateKey: Buffer.from(
          envService.get('AUTH_JWT_PRIVATE_KEY'),
          'base64',
        ),
        publicKey: Buffer.from(envService.get('AUTH_JWT_PUBLIC_KEY'), 'base64'),
        signOptions: {
          algorithm: 'RS256',
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
      }),
    }),
    CryptographyModule,
    AccountsModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticateGuard,
    },

    /// //////////////////////////
    //  Services
    /// //////////////////////////
    {
      provide: TLoginService,
      useClass: LoginService,
    },
    {
      provide: TSignUpService,
      useClass: SignUpService,
    },
    {
      provide: TGetCurrentUserService,
      useClass: GetCurrentUserService,
    },
    {
      provide: TGenerateTokensService,
      useClass: GenerateTokensService,
    },
  ],
  controllers: [LoginController, SignUpController],
  exports: [TGetCurrentUserService],
})
export class AuthenticateModule {}
