import { LoggerService, Logger, Inject, Controller, Get, Query, HttpCode, BadRequestException, UseGuards, Post, Body, Res } from '@nestjs/common';
import { CommandBus, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GetDetailInfoQuery } from '../application/query/get-detail.query';
import { UserDetail } from './UserDetail';
import { AuthGuard } from 'src/auth.guard';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginCommand } from '../application/command/login.command';
import { Response } from 'express';
import { PassThrough } from 'stream';
import { Tokens } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
        @Inject(Logger) private readonly logger: LoggerService,        
    ) { }
    
    @UseGuards(AuthGuard)
    @HttpCode(200)
    @Get('/detail')
    detail(@Query('id') userId: string): Promise<UserDetail> {
        if(!userId) {
            throw new BadRequestException('아이디를 입력해주세요!');
        }
        const getDetailInfoQuery = new GetDetailInfoQuery(userId);
        return this.queryBus.execute(getDetailInfoQuery);
    }

    @Post('/login')
    async login(
        @Body() dto: UserLoginDto,
        @Res({ passthrough: true }) res: Response,
    ): Promise<string> {
        const {id, password} = dto;
        const command = new LoginCommand(id, password);
        const accessToken = this.commandBus.execute<LoginCommand, Tokens>(command).then(({accessToken, refreshToken}) => {
            this.logger.log(refreshToken);   
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            });
            return accessToken;
        });
        return accessToken;
    }
} 