import { ApiProperty } from '@nestjs/swagger';

export class OutputLogin {
  @ApiProperty()
  acessToken: string;
  @ApiProperty()
  userid: string;
}
