import * as jwt from 'jsonwebtoken';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import authConfig from 'src/config/authConfig';
import { ConfigType } from '@nestjs/config';

interface User {
  id: string;
  name: string;
  email: string;
}

export interface Tokens {
  accessToken: string,
  refreshToken: string,
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfig.KEY) private config: ConfigType<typeof authConfig>,
  ) { }

  login(user: User): Tokens {
    const payload = { ...user };
    
    const accessToken = jwt.sign(payload, this.config.jwtSecret as jwt.Secret, {
      expiresIn: '30s',
      audience: 'example.com',
      issuer: 'example.com',
    });
    const resfreshToken = this.createRefreshToken(user);
    return {accessToken: accessToken, refreshToken: resfreshToken};
  }

  createRefreshToken(user: User) {
    const payload = { ...user };

    return jwt.sign(payload, this.config.jwtSecret as jwt.Secret, {
      expiresIn: '14d',
      audience: 'example.com',
      issuer: 'example.com',
    });
  }

  verify(jwtString: string) {
    try {
      const payload = jwt.verify(jwtString, this.config.jwtSecret as jwt.Secret) as (jwt.JwtPayload | string) & User;

      const { id, email } = payload;

      return {
        userId: id,
        email,
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
  }
}
