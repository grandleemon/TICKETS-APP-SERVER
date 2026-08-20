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

type PostgresError = Error & {
  code?: string;
  constraint?: string;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

      return {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
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

    return {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
      createdAt: existingUser.createdAt,
    };
  }
}
