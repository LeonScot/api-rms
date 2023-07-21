// database.module.ts
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariables } from '../config/configuration';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get<string>('DB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService],
    })
  ],
})
export class DatabaseModule {}
