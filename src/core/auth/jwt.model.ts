import { UserRoleEnum } from "src/modules/users/user.schema";

export const jwtConstants = {
  secret: 'kiet6397463974kiet',
};

export interface JwtPayload {
  sub: string,
  username: string,
  role: UserRoleEnum,
  iat: number,
  exp: number
}