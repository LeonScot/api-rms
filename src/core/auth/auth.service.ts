import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RevokedTokenService } from './revoked-token.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/modules/users/user.schema';
import { MailService } from '../email/mail.service';
import { RevokedToken } from './revoked-token.schema';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService, private revokedTokenService: RevokedTokenService, private mailService: MailService) {}

    async validateUser(email: string, password: string): Promise<string | null> {
        const user = await this.userService.findByEmail(email);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {

            const { password, ...result } = user;
            const payload = { sub: user._id, username: user.email, role: user.role };

            const  access_token = await this.jwtService.signAsync(payload);
            const revokedToken: RevokedToken = {token: access_token};
            this.revokedTokenService.create(revokedToken);
            return access_token;
        }
        // throw new UnauthorizedException();

        return undefined;
    }

    private comparePasswords(enteredPassword: string, dbPassword: string): boolean {
        return bcrypt.compareSync(enteredPassword, dbPassword);
    }

    async revokeToken(token: string): Promise<void> {
        const tokenData = await this.revokedTokenService.findByToken(token);
        if (tokenData.revokedStatus === false) {
            this.revokedTokenService.revokeToken(tokenData);   
        }
    }

    async forgotpassEmail(email: string): Promise<boolean> {

        const user = await this.userService.findByEmail(email);

        if (user) {
            user.resetPasswordToken = uuidv4();
            await this.userService.update(user._id, user);
            await this.mailService.sendForgotPasswordEmail(user);
            return true;
        } else {
            return false;
        }

    }

    async passwordreset( data: {resetPasswordToken: string, email: string, password: string}): Promise<boolean> {

        const user = await this.userService.findByEmail(data.email);

        if (user && user.resetPasswordToken && user.resetPasswordToken === data.resetPasswordToken) {
            user.resetPasswordToken = "";
            user.password = data.password;
            await this.userService.update(user._id, user);
            return true;
        } else {
            return false;
        }

    }
}