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
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private revokedTokenService: RevokedTokenService,
        private mailService: MailService,
        private smsService: SmsService,
    ) {}

    async validateUserAndSendSmsCode(email: string, password: string, role: UserRoleEnum): Promise<boolean | string | undefined> {
        const user = await this.userService.findByEmailnRole(email, role);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {
            if (user.twoFA === true) {
                return await this.smsService.sendVerificationCode(user.phoneNumber);
            } else {
                return await this.validateUser(email, password, role);
            }
        }
        // throw new UnauthorizedException();
        return false;
    }

    async validateUserAndSmsCode(email: string, password: string, smsCode: string, role: UserRoleEnum): Promise<string | undefined> {
        const user = await this.userService.findByEmailnRole(email, role);
        const codeVerification = await this.smsService.verifyCode(user.phoneNumber, smsCode);
        if (user && codeVerification === true && user.verified === true && this.comparePasswords(password, user.password)) {
            
            const { password, ...result } = user;
            const payload: UserSessionInfo = { sub: user._id, username: user.email, role: user.role, bgColor: user.backGroundColor };

            const access_token = await this.jwtService.signAsync(payload);
            const revokedToken: RevokedToken = {token: access_token};
            this.revokedTokenService.create(revokedToken);
            return access_token;
        }
        // throw new UnauthorizedException();

        return undefined;
    }

    async validateUser(email: string, password: string, role: UserRoleEnum): Promise<string | undefined> {
        const user = await this.userService.findByEmailnRole(email, role);
        if (user && user.verified === true && this.comparePasswords(password, user.password)) {
            
            const { password, ...result } = user;
            const payload: UserSessionInfo = { sub: user._id, username: user.email, role: user.role, bgColor: user.backGroundColor };

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

    async isPhoneNumberUnique(phoneNumber: string) {
        return await this.userService.isPhoneNumberUnique(phoneNumber);
    }

}