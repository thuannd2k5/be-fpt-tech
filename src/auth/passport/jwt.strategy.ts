import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Import ConfigService
import { IUser } from '../../users/user.interface';
import { RolesService } from '../../roles/roles.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private roleService: RolesService,
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'), // Get secret from ConfigService
        });
    }

    async validate(payload: IUser) {
        const currentUser = await this.usersService.findOne(payload._id) as any;
        if (!currentUser || typeof currentUser === 'string') return null;
        const { _id, name, email, role } = currentUser;

        const userRole = role as unknown as { _id: string, name: string };
        const temp = (await this.roleService.findOne(userRole._id)).toObject();

        return {
            _id,
            name,
            email,
            role,
            permissions: temp?.permissions ?? []
        };
    }
}
