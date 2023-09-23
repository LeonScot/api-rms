import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/users/user.module';
import { RevokedToken, RevokedTokenSchema } from './revoked-token.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { RevokedTokenService } from './revoked-token.service';
import { MailModule } from '../email/mail.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    SmsModule,
    MongooseModule.forFeature([{ name: RevokedToken.name, schema: RevokedTokenSchema }])
  ],
  controllers: [AuthController],
  providers: [AuthService, RevokedTokenService]
})
export class AuthModule {}
