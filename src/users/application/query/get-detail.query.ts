import { IQuery } from '@nestjs/cqrs';

export class GetDetailInfoQuery implements IQuery {
  constructor(
    readonly userId: string,
  ) { }
}