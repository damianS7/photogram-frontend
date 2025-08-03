export interface JwtPayload {
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}
