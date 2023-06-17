import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class PasswordHashPipe implements PipeTransform<any> {
  async transform(value: User, metadata: ArgumentMetadata) {
    // Check if the value contains a password field
    if (value && value.password) {
      // Generate a salt and hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(value.password, saltRounds);

      // Replace the plain password with the hashed password
      value.password = hashedPassword;
      
    }

    return value;
  }
}
