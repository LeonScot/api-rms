import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: User) {
    const url = `localhost:6600/signup/user/verify?token=${user.verificationToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to RMS App! Confirm your Email',
      // template: './confirmation', // `.hbs` extension is appended automatically
      // text: user.name + ' ' + url,
      html: `<h3>Click below link to verify your email.</h3><br><a target="_blank" href="${url}">Verify</a>`
      // context: { // ✏️ filling curly brackets with content
      //   name: user.name,
      //   url,
      // },
    });
  }

  async sendForgotPasswordEmail(user: User) {
    const url = `localhost:6600/login/forgot-pass-reset?token=${user.resetPasswordToken}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to RMS App! Reset you password',
      // template: './confirmation', // `.hbs` extension is appended automatically
      // text: user.name + ' ' + url,
      html: `<h3>Click below link to reset your password.</h3><br><a target="_blank" href="${url}">Reset</a>`
      // context: { // ✏️ filling curly brackets with content
      //   name: user.name,
      //   url,
      // },
    });
  }
}
