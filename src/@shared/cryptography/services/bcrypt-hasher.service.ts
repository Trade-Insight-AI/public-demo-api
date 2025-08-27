import { hash, compare } from 'bcryptjs';

export abstract class THasher {
  abstract compare(plain: string, hash: string): Promise<boolean>;
  abstract hash(plain: string): Promise<string>;
}

export class BcryptHasher implements THasher {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
