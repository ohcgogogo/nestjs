import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { Injectable } from "@nestjs/common";
import { AuthService, Tokens } from "src/auth/auth.service";

@Injectable()
@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, Tokens> {
    constructor(
        private authService: AuthService,
    ) {}

    async execute(command: LoginCommand): Promise<Tokens> {
        const {id, password} = command;
        return this.authService.login({
            id: id,
            name: "name",
            email: "email",
        });;
    }
}