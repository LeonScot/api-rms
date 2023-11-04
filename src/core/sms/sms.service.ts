import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';
import { EnvironmentVariables } from '../config/configuration';

@Injectable()
export class SmsService {
  private twilioClient: Twilio.Twilio;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    // Initialize Twilio client with your account SID and auth token
    this.twilioClient = Twilio(this.configService.get('TWILIO_ACCOUNT_SID'), this.configService.get('TWILIO_AUTH_TOKEN'));
  }

  async sendSms(to: string, body: string): Promise<boolean> {
    try {
      // Use the Twilio client to send an SMS message
      await this.twilioClient.messages.create({
        body,
        to,
        from: this.configService.get('TWILIO_PHONE_NUMBER'), // Your Twilio phone number
      });
      return true;
    } catch (error) {
      // Handle error here
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  async sendVerificationCode(phoneNumber: string): Promise<boolean> {
    const validPhoneNumber = await this.twilioClient.lookups.v2.phoneNumbers(phoneNumber).fetch().then(res => res.valid).catch( _ => false );
    if (!validPhoneNumber) {
      return false;
    }
    const sent = await this.twilioClient.verify.v2.services(this.configService.get('TWILIO_VERIFY_SERVICE_SID'))
      .verifications
      .create({ to: phoneNumber, channel: 'sms' })
      .then( _ => true)
      .catch(error => {
        console.error(error);
        return false
      });
      
    return sent;
  }

  async verifyCode(phoneNumber: string, code: string): Promise<boolean> {
    const verification = await this.twilioClient.verify.v2.services(this.configService.get('TWILIO_VERIFY_SERVICE_SID'))
    .verificationChecks
    .create({ to: phoneNumber, code });
    
    return verification.status === 'approved';
  }
}
