import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/users/user.module';
import { RevokedToken, RevokedTokenSchema } from './revoked-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokedTokenService } from './revoked-token.service';
import { MailModule } from '../email/mail.module';
import { SmsModule } from '../sms/sms.module';
import { SmsCodeService } from './sms-code.service';
import { SmsCode, SmsCodeSchema } from './sms-code.schema';

@Module({
  imports: [
    UserModule,
    MailModule,
    SmsModule,
    MongooseModule.forFeature([{ name: RevokedToken.name, schema: RevokedTokenSchema }]),
    MongooseModule.forFeature([{ name: SmsCode.name, schema: SmsCodeSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, RevokedTokenService, SmsCodeService]
})
export class AuthModule {}
