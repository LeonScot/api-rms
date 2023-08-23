import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RevokedTokenService } from './revoked-token.service';
import { v4 as uuidv4 } from 'uuid';
import { UserRoleEnum } from 'src/modules/users/user.schema';
import { MailService } from '../email/mail.service';
import { RevokedToken } from './revoked-token.schema';
import { UserSessionInfo } from './jwt.model';
import { SmsCodeService } from './sms-code.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private revokedTokenService: RevokedTokenService,
        private mailService: MailService,
        private smsCodeService: SmsCodeService
    ) {}

    async validateUserAndSendSmsCode(email: string, password: string, role: UserRoleEnum): Promise<boolean> {
        const user = await this.userService.findByEmailnRole(email, role);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {
            return await this.smsCodeService.sendVerificationCode(user.phoneNumber, user._id);;
        }
        // throw new UnauthorizedException();
        return false;
    }

    async validateUser(email: string, password: string, smsCode: string, role: UserRoleEnum): Promise<string | undefined> {
        const user = await this.userService.findByEmailnRole(email, role);
        const smsCodeRec = await this.smsCodeService.findByUserIdAndCode(user._id, smsCode);
        if (smsCodeRec && smsCodeRec.code === smsCode.trim() && user && user.verified === true && this.comparePasswords(password, user.password)) {
            await this.smsCodeService.markAsVerified(smsCodeRec);
            const { password, ...result } = user;
            const payload: UserSessionInfo = { sub: user._id, username: user.email, role: user.role };

            const access_token = await this.jwtService.signAsync(payload);
            const revokedToken: RevokedToken = {token: access_token};
            this.revokedTokenService.create(revokedToken);
            return access_token;
        }
        // throw new UnauthorizedException();

        return undefined;
    }

    async validateAdmin(email: string, password: string, role: UserRoleEnum): Promise<string | undefined> {
        const user = await this.userService.findByEmailnRole(email, role);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {

            const { password, ...result } = user;
            const payload: UserSessionInfo = { sub: user._id, username: user.email, role: user.role };

            const access_token = await this.jwtService.signAsync(payload);
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