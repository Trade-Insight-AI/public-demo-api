import { Result } from './result';
import { IRequestContext } from '../protocols/request-context.struct';
import { ILogger } from './custom-logger';

export abstract class AbstractService<Dto, Response> {
  logger?: ILogger;

  execute: (
    payload: Dto,
    context?: IRequestContext,
  ) => Promise<Result<Response>>;
}
