
import { Logger, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersController } from './interface/users.controller';
import { GetDetailQueryHandler } from './application/query/get-detail.handler';
import { AuthModule } from 'src/auth/auth.module';
import { LoginHandler } from './application/command/login.handler';

const commandHandlers = [
    LoginHandler,
];
  
const queryHandlers = [
    GetDetailQueryHandler,
];

@Module({
    imports: [
        CqrsModule,
        AuthModule,
    ],
    controllers: [UsersController],
    providers: [
        Logger,
        ...queryHandlers,
        ...commandHandlers,
    ],
  })
  export class UsersModule { }