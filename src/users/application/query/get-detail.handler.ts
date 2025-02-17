import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UserDetail } from '../../interface/UserDetail';
import { GetDetailInfoQuery } from './get-detail.query';

@QueryHandler(GetDetailInfoQuery)
export class GetDetailQueryHandler implements IQueryHandler<GetDetailInfoQuery> {
  constructor(
  ) { }

  async execute(query: GetDetailInfoQuery): Promise<UserDetail> {
    const { userId } = query;

    return {
      id: userId,
      name: "name",
      email: "email",
    };
  }
}
