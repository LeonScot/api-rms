import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { UserModule } from './modules/users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './core/auth/jwt.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './core/auth/auth.guard';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { DiscountCodeTypeModule } from './modules/discount-code-type/discount-code-type.module';
import { UserSubscriptionModule } from './modules/user-subscription/user-subscription.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CampaignModule } from './modules/campaign/campaign.module';
import configuration from './core/config/configuration';
import { RewardModule } from './modules/reward/reward.module';
import { ServicesOfferedModule } from './modules/ServicesOffered/services-offered.module';
import { BookingModule } from './modules/Booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: 'environments/.env',
      cache: true,
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Specify the directory where uploaded files are stored
      serveRoot: '/uploads', // Specify the base URL path for serving the static files
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    SubscriptionModule,
    DiscountCodeTypeModule,
    UserSubscriptionModule,
    AttachmentModule,
    CampaignModule,
    RewardModule,
    ServicesOfferedModule,
    BookingModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {} 

// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(HashMiddleware)
//       .forRoutes({ path: 'user', method: RequestMethod.POST });
//   }
// }
