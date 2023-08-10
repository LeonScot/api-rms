import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'src/core/auth/revoked-token.schema';
import { BookingService } from 'src/modules/booking/booking.service';
import { Booking } from 'src/modules/booking/booking.schema';
import { QrCodeService } from 'src/core/qr-code/qr-code.service';

@Injectable()
export class BookingPayloadPipe implements PipeTransform<any> {

  constructor(private jwtService: JwtService, private bookingService: BookingService, private qrCodeService: QrCodeService) {}

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

    console.log('token', token);
    

    const serviceId = request.body['serviceId'] as string;
    const booking = await this.bookingService.findById(serviceId);

    const bookingPayload: Booking = {
      serviceId,
      userId: decodedToken.sub,
      qrCode: await this.qrCodeService.generateQrCodeBase64({serviceId, userId: decodedToken.sub, stamp: Date.now()})
    }

    return bookingPayload;
  }
}
