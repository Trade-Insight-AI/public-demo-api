import { Body, Controller, Post } from '@nestjs/common';

import { ZodValidationPipe } from '@/@shared/pipes/zod-validation.pipe';
import { Public } from '@/modules/authenticate/metadatas-for-decorators';
import { loginDtoBodySchema, TLoginDtoBodySchema } from '../dto/login.dto';
import { TLoginService } from '../services/login.service';
import { AbstractApplicationException } from '@/@shared/errors/abstract-application-exception';
import { ReqContext } from '@/@decorators/request-context.decorator';
import { IRequestContext } from '@/@shared/protocols/request-context.struct';
import { IAccountPresenter } from '@/modules/accounts/presenters/account.presenter';
import { ApiDocumentation } from '@/@decorators/api-documentation.decorator';
import { LoginDocumentation } from '../@docs/login.doc';

@Controller('auth/login')
@Public()
export class LoginController {
  constructor(
    /// //////////////////////////
    //  Services
    /// //////////////////////////
    private loginService: TLoginService,

    /// //////////////////////////
    //  Presenter
    /// //////////////////////////
    private accountPresenter: IAccountPresenter,
  ) {}

  @Post()
  @ApiDocumentation(LoginDocumentation)
  async handle(
    @ReqContext() context: IRequestContext,

    @Body(new ZodValidationPipe(loginDtoBodySchema))
    body: TLoginDtoBodySchema,
  ) {
    const result = await this.loginService.execute(body, context);

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
