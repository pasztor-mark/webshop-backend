import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import passport from '@nestjs/passport';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && await (password === user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, req: any, res: any) {
    const validatedUser = await this.validateUser(user.email, user.password);
    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    passport.serializeUser()
    const payload = { username: validatedUser.email, sub: validatedUser.id };
    const token = this.jwtService.sign(payload);
    req.session.token = token;
    res.cookie('token', token, { httpOnly: true, secure: false }); 
    return res.send({ message: 'Login successful' });
  }
}
