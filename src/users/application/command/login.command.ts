import { ICommand } from "@nestjs/cqrs";

export class LoginCommand implements ICommand {
    constructor(
        readonly id: string,
        readonly password: string,
    ) {}
}