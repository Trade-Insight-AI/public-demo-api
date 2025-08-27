import { AbstractApplicationException } from '../errors/abstract-application-exception';

export class Result<T> {
  public error?: AbstractApplicationException | Error;

  private value?: T;

  private constructor(
    isSuccess: boolean,
    error?: AbstractApplicationException | Error,
    value?: T,
  ) {
    this.error = error;
    this.value = value;

    Object.freeze(this);
  }

  public getValue(): T | null {
    if (!this.value) {
      return null;
    }

    return this.value;
  }

  public static success<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(
    error: AbstractApplicationException | Error,
  ): Result<U> {
    return new Result<U>(false, error, undefined);
  }
}
