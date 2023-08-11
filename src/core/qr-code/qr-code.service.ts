import { Injectable } from '@nestjs/common';
import * as qr from 'qrcode';

@Injectable()
export class QrCodeService {
  async generateQrCodeBase64(jsonData: object): Promise<string> {
    const qrCodeString = JSON.stringify(jsonData);
    const qrCodeBuffer = await qr.toBuffer(qrCodeString);

    return qrCodeBuffer.toString('base64');
  }
}
