import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<string | null> {
        const user = await this.userService.findByEmail(email);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {

            const { password, ...result } = user;
            const payload = { sub: user._id, username: user.email };

            const  access_token = await this.jwtService.signAsync(payload);
            return access_token;
        }
        // throw new UnauthorizedException();

        return undefined;
    }

    private comparePasswords(enteredPassword: string, dbPassword: string): boolean {
        return bcrypt.compareSync(enteredPassword, dbPassword);
    }
}