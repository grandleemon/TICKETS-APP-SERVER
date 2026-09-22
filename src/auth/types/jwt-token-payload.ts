export type JwtTokenPayload = {
  sub: string;
  sessionId: string;
  type: 'access' | 'refresh';
};
