import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CrudService } from '../api/crud.service';
import { SmsCode } from './sms-code.schema';
import { SmsService } from '../sms/sms.service';
import { ISort } from '../api/api.interface';

@Injectable()
export class SmsCodeService extends CrudService<SmsCode> {
  constructor(
    @InjectModel(SmsCode.name) private readonly smsCodeModel: Model<SmsCode>,
    private smsService: SmsService
  ) {
    super(smsCodeModel);
  }

  async sendVerificationCode(phoneNumber: string, userId: string): Promise<boolean> {
    // Generate a random verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    await this.create({user: userId, code: verificationCode});
    // Save the verification code to associate with the user (e.g., in a database)

    // Send the verification code via SMS
    const message = `Your RMS login verification code is: ${verificationCode}`;
    const success = await this.smsService.sendSms(phoneNumber, message);
    // const success = true;

    return success;
  }

  async findByUserIdAndCode(userId: string, smsCode: string) {
    const query = {user: userId, code: smsCode.trim(), verified: false};
    const sort: ISort = {field: 'createdDate', order: 'desc'};
    return await this.findOneByQuery(query, sort);
  }

  async markAsVerified(smsCode: SmsCode) {
    smsCode.verified = true;
    return await this.update(smsCode._id, smsCode);
  }

  public async checkCodeVerification(userId: string, smsCode: string) {
    const smsCodeRec = await this.findByUserIdAndCode(userId, smsCode);
    const notExpired = this.isWithin120Seconds(smsCodeRec.createdDate);
    await this.markAsVerified(smsCodeRec); 
    return smsCodeRec && smsCodeRec.code === smsCode.trim() && notExpired;
  }

  private isWithin120Seconds(datetime: Date) {
    const currentTime = new Date();
    const inputTime = new Date(datetime);
  
    const timeDifferenceInSeconds = (currentTime.valueOf() - inputTime.valueOf()) / 1000;
  
    return timeDifferenceInSeconds <= 120;
  }

  async sendPhoneNumberVerificationCode(phoneNumber: string) {
    return await this.smsService.sendVerificationCode(phoneNumber);
  }
}
