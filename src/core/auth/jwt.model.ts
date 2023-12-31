import { UserRoleEnum } from "src/modules/users/user.schema";

export const jwtConstants = {
  secret: 'kiet6397463974kiet',
};

export interface UserSessionInfo {
  sub: string;
  username: string;
  role: UserRoleEnum;
  bgColor?: string | null;
  iat?: number;
  ext?: number;
}