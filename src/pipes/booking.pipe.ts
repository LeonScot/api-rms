import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'src/core/auth/revoked-token.schema';
import { QrCodeService } from 'src/core/qr-code/qr-code.service';
import { Booking } from 'src/modules/Booking/booking.schema';
import { BookingService } from 'src/modules/Booking/booking.service';

@Injectable()
export class BookingPipe implements PipeTransform {

  constructor(
    private jwtService: JwtService, private bookingService: BookingService, private qrCodeService: QrCodeService
  ) {}

  async transform(request: Request, metadata: ArgumentMetadata) {
    // Check if the value contains a password field
    if (!request || !request.headers || !request.headers.authorization) {
      throw new BadRequestException('Authorization header is missing');
    }

    const token = request.headers.authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token) as TokenPayload;

    if (!decodedToken) {
      throw new BadRequestException('Invalid token');
    }

    const _id = request.body['id'] as string;
    const isCompleted = await this.bookingService.isCompleted(_id, decodedToken.sub);
    
    const bookingPayload: Booking | null = isCompleted === false ? null : {
      servicesoffered: _id,
      user: decodedToken.sub,
      qrCode: JSON.stringify({service: _id, user: decodedToken.sub, stamp: Date.now()})
    };

    return bookingPayload;
  }
}
