import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { compareSync } from 'bcrypt';
import { lastValueFrom, timeout } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_CLIENT')
    private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any | null> {
    try {
      const user = await lastValueFrom(
        this.client
          .send({ role: 'user', cmd: 'get' }, { email })
          .pipe(timeout(5000)),
      );

      if (compareSync(password, user?.password)) {
        return user;
      }

      return null;
    } catch (e) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(user) {
    const payload = { user, sub: user.id };
    return {
      userId: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  validateToken(jwt: string) {
    try{
      return this.jwtService.verify(jwt);
    }catch(e){
      return null
    }
  }
}
