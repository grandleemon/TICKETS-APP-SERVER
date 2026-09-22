import { JwtTokenPayload } from './jwt-token-payload';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  auth: JwtTokenPayload;
}
