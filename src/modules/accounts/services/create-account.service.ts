import { Injectable } from '@nestjs/common';
import { ILogger } from '@/@shared/classes/custom-logger';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import {
  createAccountDtoServiceSchema,
  TCreateAccountDtoServiceSchema,
} from '../dto/create-account.dto';
import { IAccountsRepository } from '../repositories/accounts.repository';
import { AccountAlreadyExistsException } from '../errors/account-already-exists.exception';
import { THasher } from '@/@shared/cryptography/services/bcrypt-hasher.service';
import { Normalize } from '@/@shared/utils/normalize';
import { IAccountModel } from '../models/account.struct';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';

export abstract class TCreateAccountService extends AbstractService<
  TCreateAccountDtoServiceSchema,
  IAccountModel
> {}

@Injectable()
export class CreateAccountService implements TCreateAccountService {
  constructor(
    /// //////////////////////////
    //  Repositories
    /// //////////////////////////
    private accountsRepository: IAccountsRepository,

    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    private hasher: THasher,
    public logger: ILogger,
  ) {
    this.logger.setContextName(CreateAccountService.name);
  }

  async execute(
    serviceDto: TCreateAccountDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<IAccountModel>> {
    const validateDtoResult = await this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const { email, password } = validateDtoResult.getValue()!;

    const normalizedEmail = Normalize.email(email);

    const hashedPassword = await this.hasher.hash(password);

    const account = await this.accountsRepository.create({
      email: normalizedEmail,
      password: hashedPassword,
    });

    this.logger.warn(`Account created successfully: ${account.id}`, context);

    return Result.success(account);
  }

  async validateDto(
    serviceDto: TCreateAccountDtoServiceSchema,
  ): Promise<Result<TCreateAccountDtoServiceSchema>> {
    try {
      const validatedDto = createAccountDtoServiceSchema.parse(serviceDto);
      const normalizedEmail = Normalize.email(validatedDto.email);

      const existingAccount = await this.accountsRepository.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingAccount) {
        return Result.fail(new AccountAlreadyExistsException());
      }

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
