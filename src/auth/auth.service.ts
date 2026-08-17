import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const checkPassword = await this.usersService.isValidPassword(pass, user.password);
            if (checkPassword === true) {
                return user;
            }
        }
        return null;
    }
}
