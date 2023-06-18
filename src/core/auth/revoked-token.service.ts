import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RevokedToken } from './revoked-token.schema';

@Injectable()
export class RevokedTokenService {
  constructor(
    @InjectModel(RevokedToken.name) private readonly revokedTokenModel: Model<RevokedToken>,
  ) {}

  async create(token: string): Promise<RevokedToken> {
    const revokedToken = new this.revokedTokenModel({ token });
    return revokedToken.save();
  }

  async findOne(token: string): Promise<RevokedToken | null> {
    return this.revokedTokenModel.findOne({token}).exec();
  }

  async revokeToken(token: RevokedToken): Promise<RevokedToken | null> {
    token.revokedStatus = true;
    return this.revokedTokenModel.findByIdAndUpdate(token._id, token, { new: true }).exec();
  }

  
  async isTokenRevoked(token: string): Promise<boolean | null> {
    const tokenData =  await this.revokedTokenModel.findOne({token}).exec();
    return tokenData.revokedStatus === true ? true : false;
  }
}
