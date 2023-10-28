import axios from 'axios';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcryptjs';
import {
  HttpException,
  Injectable,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

import { Users } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { GoogleUser } from './auth.types';

import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return await hash(password, 10);
  }

  async comparePassword(inputPassword: string, userPassword: string) {
    return await compare(inputPassword, userPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    const passwordEqual = await this.comparePassword(password, user.password);

    if (passwordEqual) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async isVerifiedGoogleUser(sub_id: string, accessToken: string) {
    const resp = await axios.get(
      `${process.env.GOOGLE_API_ENDPOINT}/oauth2/v3/tokeninfo?access_token=${accessToken}`,
    );
    return resp.data.sub === sub_id;
  }

  async googleLogin(data: GoogleUser) {
    const verified = await this.isVerifiedGoogleUser(
      data.sub_id,
      data.accessToken,
    );

    if (!verified) {
      throw new UnauthorizedException('Unauthorized');
    }

    const user = await this.usersService.findOne(data.email);

    if (!user) {
      const createdUser = await this.usersService.create({
        email: data.email,
        sub_id: data.sub_id,
        first_name: data.firstName,
        last_name: data.lastName,
      });
      return this.createCredentials(createdUser);
    }

    if (user.id === data.sub_id) {
      return this.createCredentials(user);
    }
  }

  async createCredentials(user: Users) {
    const payload = { email: user.email, id: user.id };

    const tokens = {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '4w' }),
    };

    await this.usersService.updateRefreshToken({
      id: user.id,
      refresh_token: tokens.refresh_token,
    });

    return tokens;
  }

  async logout(id: string) {
    return await this.usersService.updateRefreshToken({
      id,
      refresh_token: null,
    });
  }

  async localRegister(data: RegisterUserDto) {
    const { email, password, first_name, last_name } = data;

    const hashedPassword = await this.hashPassword(data.password);

    const user = await this.usersService.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new HttpException('create user error', HttpStatus.BAD_REQUEST);
    }

    return this.createCredentials(user);
  }
}