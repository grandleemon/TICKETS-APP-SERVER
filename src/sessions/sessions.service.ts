import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { createHash } from 'node:crypto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async createSession(
    userId: string,
    sessionId: string,
    refreshToken: string,
    expiresAt: Date,
  ) {
    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const session = this.sessionRepository.create({
      id: sessionId,
      user: { id: userId },
      refreshTokenHash,
      expiresAt,
      revokedAt: null,
    });

    return await this.sessionRepository.save(session);
  }
}
