import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, lastValueFrom, tap, timeout } from 'rxjs';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_CLIENT')
    private readonly client: ClientProxy,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    if (!req.headers['authorization']) {
      return next.handle();
    }

    const response = await lastValueFrom(
      this.client
        .send(
          { role: 'auth', cmd: 'check' },
          { jwt: req.headers['authorization']?.split(' ')[1] },
        )
        .pipe(timeout(5000)),
    );

    req.body.userId = response.user.id;

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-Response-Time', `${Date.now() - now}ms`);
      }),
    );
  }
}
