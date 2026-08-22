import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage } from "../decorator/customize";
import { RegisterUserDto } from "../users/dto/create-user.dto";


@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ResponseMessage('Login successfully')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Public()
    @Post('/register')
    @ResponseMessage('Register a new user')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }

}