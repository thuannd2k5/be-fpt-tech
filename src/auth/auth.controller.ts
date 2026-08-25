import { Body, Controller, Get, Post, Request, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage, User } from "../decorator/customize";
import { RegisterUserDto } from "../users/dto/create-user.dto";
import { Response } from "express";
import { IUser } from "../users/user.interface";


@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ResponseMessage('Login successfully')
    async login(
        @Request() req,
        @Res({ passthrough: true }) response: Response
    ) {
        return this.authService.login(req.user, response);
    }

    @Public()
    @Post('/register')
    @ResponseMessage('Register a new user')
    handleRegister(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto);
    }


    @Get('/account')
    @ResponseMessage('Get user account information')
    handleGetAccount(@User() user: IUser) {
        return { user };
    }
}