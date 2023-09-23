import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private twilioClient: Twilio.Twilio;

  constructor() {
    // Initialize Twilio client with your account SID and auth token
    this.twilioClient = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, body: string): Promise<boolean> {
    try {
      // Use the Twilio client to send an SMS message
      await this.twilioClient.messages.create({
        body,
        to,
        from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
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
    const sent = await this.twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
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
    const verification = await this.twilioClient.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks
    .create({ to: phoneNumber, code });
    
    return verification.status === 'approved';
  }
}
