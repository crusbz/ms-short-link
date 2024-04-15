import {
  CanActivate,
  ExecutionContext,
  HttpException,
  UnauthorizedException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try{
      const req = context.switchToHttp().getRequest();

    if (!req.headers['authorization']) {
      throw new HttpException('Unauthorized', 401);
    }

    const res = await lastValueFrom(
      this.client
        .send(
          { role: 'auth', cmd: 'check' },
          { jwt: req.headers['authorization']?.split(' ')[1] },
        )
        .pipe(timeout(5000)),
    );

    req.userId = res.user.id;

    return res;
    } catch(e){
      throw new UnauthorizedException('Access Denied');
    }
  }
}
