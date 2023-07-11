// database.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// console.log('process.env.DB_URI', process.env.DB_URI);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://dmcawahab:i3RJ4Jl0PGDhalNA@cluster0.3dk8ogi.mongodb.net/rms-db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
  ],
})
export class DatabaseModule {}
