// database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
console.log('process.env.DB_URI', process.env.DB_URI);

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
  ],
})
export class DatabaseModule {}
