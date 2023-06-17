import { Injectable, PipeTransform } from '@nestjs/common';
import { User } from 'src/modules/users/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssignVerificationTokenPipe implements PipeTransform {
  transform(user: User): User {
    const updatedUser = { ...user };
    updatedUser.verificationToken = uuidv4();
    return updatedUser;
  }
}
