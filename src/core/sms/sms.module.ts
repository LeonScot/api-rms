import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService], // 👈 export for DI
})
export class SmsModule {}
