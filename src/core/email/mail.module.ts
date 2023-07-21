import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/configuration';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
        // or
        transport: {
          port: Number(configService.get('MAIL_PORT')),
          host: configService.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"RMS Org" <${configService.get('MAIL_USER')}>`,
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
