import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { Public, ResponseMessage, User } from "../decorator/customize";
import { RegisterUserDto } from "../users/dto/create-user.dto";
import { Request, Response } from "express";
import { IUser } from "../users/user.interface";


@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ResponseMessage('Login successfully')
    async login(
        @Req() req,
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


    @Public()
    @Get('/refresh')
    @ResponseMessage('Refresh user token')
    handleRefreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, response);
    }

    @Post('/logout')
    @ResponseMessage('Logout User')
    handleLogout(
        @User() user: IUser,
        @Res({ passthrough: true }) response: Response) {
        return this.authService.logout(user, response);
    }
}