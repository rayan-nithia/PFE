import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, response: Response) {
    const expiresAccessToken = new Date();
    expiresAccessToken.setMilliseconds(
      expiresAccessToken.getTime() +
        parseInt(
          this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
        ),
    );

    const tokenPayload: TokenPayload = {
      userId: user.id.toString(),
    };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION_MS')}ms`,
    });

    response.cookie('Authentication', accessToken, {
      expires: expiresAccessToken,
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
    });
    return { user: user, token: accessToken };
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUser(email);
      const authenticated = await compare(password, user.password);
      if (!authenticated) throw new UnauthorizedException();
      return user;
    } catch (error) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
  }
}
