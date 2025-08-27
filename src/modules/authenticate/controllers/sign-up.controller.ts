import { Body, Controller, Post } from '@nestjs/common';

import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import { Public } from '@/modules/authenticate/metadatas-for-decorators';
import { signUpDtoBodySchema, TSignUpDtoBodySchema } from '../dto/sign-up.dto';
import { TSignUpService } from '../services/sign-up.service';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { SignUpDocumentation } from '../@docs/sign-up.doc';
import { IAccountPresenter } from '@/modules/accounts/presenters/account.presenter';

@Controller('auth/sign-up')
@Public()
export class SignUpController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private signUpService: TSignUpService,

    /// //////////////////////////
    //  Presenters
    /// //////////////////////////
    private accountPresenter: IAccountPresenter,
  ) {}

  @Post()
  @ApiDocumentation(SignUpDocumentation)
  async signUp(
    @Body(new ZodValidationPipe(signUpDtoBodySchema))
    signUpDto: TSignUpDtoBodySchema,
    @ReqContext() context?: IRequestContext,
  ) {
    const result = await this.signUpService.execute(signUpDto, context);

    if (result.error) {
      if (result.error instanceof AbstractApplicationException) {
        result.error.context = context;
      }

      throw result.error;
    }

    const { accessToken, refreshToken, account } = result.getValue()!;

    return {
      accessToken,
      refreshToken,
      account: this.accountPresenter.presentWithoutTokens(account),
    };
  }
}
