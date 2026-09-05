import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/user.interface';
import { RegisterUserDto } from '../users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleService: RolesService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValid = await this.usersService.isValidPassword(pass, user.password);
            if (isValid === true) {
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.roleService.findOne(userRole._id);

                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser;
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.createRefreshToken(payload);
        //update refresh token to user
        await this.usersService.updateUserToken(refresh_token, _id);

        //set refresh token to cookie
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: Number(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000
        });

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role,
                permissions
            }
        };
    }

    async register(user: RegisterUserDto) {
        let newUser = await this.usersService.register(user);

        return newUser;
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: Number(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        });
        return refreshToken;
    }

    processNewToken = async (refreshToken: string, response: Response) => {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            });
            let user = await this.usersService.findUserByToken(refreshToken);
            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refresh_token = this.createRefreshToken(payload);
                //update refresh token to user
                await this.usersService.updateUserToken(refresh_token, _id.toString());

                //fetch user role
                const userRole = user.role as unknown as { _id: string, name: string };
                const temp = await this.roleService.findOne(userRole._id);

                //set refresh token to cookie
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: Number(this.configService.get<string>('JWT_REFRESH_EXPIRE')) * 1000
                });

                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException('Invalid refresh token. Vui lòng đăng nhập lại.');
            }
        } catch (error) {
            throw new BadRequestException('Invalid refresh token. Vui lòng đăng nhập lại.');
        }
    }

    logout = async (user: IUser, response: Response) => {
        await this.usersService.updateUserToken("", user._id);
        response.clearCookie("refresh_token");
        return "ok"
    }
}
