import { Injectable } from '@nestjs/common';
import { Result } from '@/@shared/classes/result';
import { AbstractService } from '@/@shared/classes/service';
import {
  signUpDtoServiceSchema,
  TSignUpDtoBodySchema,
  TSignUpDtoServiceSchema,
} from '../dto/sign-up.dto';
import { ILogger } from '@/@shared/classes/custom-logger';
import { TCreateAccountService } from '@/modules/accounts/services/create-account.service';
import { TGenerateTokensService } from './generate-tokens.service';
import { IAccountModel } from '@/modules/accounts/models/account.struct';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';

export interface ISignUpServiceResponse {
  accessToken: string;
  refreshToken: string;
  account: IAccountModel;
}

export abstract class TSignUpService extends AbstractService<
  TSignUpDtoBodySchema,
  ISignUpServiceResponse
> {}

@Injectable()
export class SignUpService implements TSignUpService {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private createAccountService: TCreateAccountService,
    private generateTokensService: TGenerateTokensService,

    /// //////////////////////////
    //  Providers
    /// //////////////////////////
    public logger: ILogger,
  ) {
    this.logger.setContextName(SignUpService.name);
  }

  async execute(
    serviceDto: TSignUpDtoServiceSchema,
    context?: IRequestContext,
  ): Promise<Result<ISignUpServiceResponse>> {
    const validateDtoResult = this.validateDto(serviceDto);

    if (validateDtoResult.error) {
      return Result.fail(validateDtoResult.error);
    }

    const { email, password } = validateDtoResult.getValue()!;

    const createAccountServiceResult = await this.createAccountService.execute({
      email,
      password,
    });

    if (createAccountServiceResult.error) {
      return Result.fail(createAccountServiceResult.error);
    }

    const account = createAccountServiceResult.getValue()!;

    this.logger.log(`Account created successfully: ${account.id}`, context);

    const generateTokensResult = await this.generateTokensService.execute({
      accountId: account.id,
    });

    if (generateTokensResult.error) {
      return Result.fail(generateTokensResult.error);
    }

    const { accessToken, refreshToken } = generateTokensResult.getValue()!;

    return Result.success({
      accessToken,
      refreshToken,
      account,
    });
  }

  validateDto(
    serviceDto: TSignUpDtoServiceSchema,
  ): Result<TSignUpDtoServiceSchema> {
    try {
      const validatedDto = signUpDtoServiceSchema.parse(serviceDto);

      return Result.success(validatedDto);
    } catch (error) {
      return Result.fail(error as Error);
    }
  }
}
