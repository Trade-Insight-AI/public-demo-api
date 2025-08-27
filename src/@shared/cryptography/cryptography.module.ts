import { Module } from '@nestjs/common';
import { BcryptHasher, THasher } from './services/bcrypt-hasher.service';
import { TJWTEncrypter, JwtEncrypter } from './services/jwt-encrypter.service';

@Module({
  imports: [],
  providers: [
    { provide: TJWTEncrypter, useClass: JwtEncrypter },
    { provide: THasher, useClass: BcryptHasher },
  ],
  exports: [TJWTEncrypter, THasher],
})
export class CryptographyModule {}
