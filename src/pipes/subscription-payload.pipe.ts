import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TokenPayload } from 'src/core/auth/revoked-token.schema';
import { addMonthsToDate } from 'src/helpers/helpers';
import { SubscriptionService } from 'src/modules/subscription/subscription.service';
import { UserSubscription } from 'src/modules/user-subscription/user-subscription.schema';

@Injectable()
export class SubscriptionPayloadPipe implements PipeTransform<any> {

  constructor(private jwtService: JwtService, private subscriptionService: SubscriptionService) {}

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

    const subId = request.body['subId'] as string;
    const subscription = await this.subscriptionService.findById(subId);

    const startDate = new Date();
    const endDate = addMonthsToDate(subscription.tenure, new Date());
    const uniqueCode = btoa(JSON.stringify({uid: decodedToken.sub, subId, startDate, endDate}));
    const subPayload: UserSubscription = {
      uniqueCode,
      startDate,
      endDate,
      autoRenew: false,
      user: decodedToken.sub,
      subscription: subId as string,
    }

    return subPayload;
  }
}
