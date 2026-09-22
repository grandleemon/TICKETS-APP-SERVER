import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { SessionsService } from '../sessions/sessions.service';
import { JwtTokenPayload } from './types/jwt-token-payload';

type PostgresError = Error & {
  code?: string;
  constraint?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionService: SessionsService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const normalizedEmail = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const passwordHash = await hash(createUserDto.password);

    const user = this.userRepository.create({
      email: normalizedEmail,
      name: createUserDto.name.trim(),
      passwordHash,
    });

    try {
      const savedUser = await this.userRepository.save(user);

      const sessionId = randomUUID();

      const accessToken = await this.signAccessToken(savedUser.id, sessionId);
      const refreshToken = await this.signRefreshToken(savedUser.id, sessionId);

      const refreshTtl = Number(
        this.configService.getOrThrow<string>('JWT_REFRESH_TTL'),
      );

      await this.sessionService.createSession(
        savedUser.id,
        sessionId,
        refreshToken,
        new Date(Date.now() + refreshTtl * 1000),
      );

      return {
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          createdAt: savedUser.createdAt,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error.driverError as PostgresError).code === '23505'
      ) {
        throw new ConflictException('Email already exists');
      }

      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const normalizedEmail = loginUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!existingUser) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordCheck = await verify(
      existingUser.passwordHash,
      loginUserDto.password,
    );

    if (!passwordCheck) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const sessionId = randomUUID();

    const accessToken = await this.signAccessToken(existingUser.id, sessionId);
    const refreshToken = await this.signRefreshToken(
      existingUser.id,
      sessionId,
    );

    const refreshTtl = Number(
      this.configService.getOrThrow<string>('JWT_REFRESH_TTL'),
    );

    await this.sessionService.createSession(
      existingUser.id,
      sessionId,
      refreshToken,
      new Date(Date.now() + refreshTtl * 1000),
    );

    return {
      user: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
        createdAt: existingUser.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  async signAccessToken(userId: string, sessionId: string) {
    const payload: JwtTokenPayload = {
      sub: userId,
      sessionId,
      type: 'access',
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: Number(process.env.JWT_ACCESS_TTL),
    });
  }

  async signRefreshToken(userId: string, sessionId: string) {
    const payload: JwtTokenPayload = {
      sub: userId,
      sessionId,
      type: 'refresh',
    };

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
    });
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        token,
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        },
      );

      if (payload.type !== 'access') {
        throw new Error();
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtTokenPayload>(
        token,
        {
          secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        },
      );

      if (payload.type !== 'refresh') {
        throw new Error();
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
