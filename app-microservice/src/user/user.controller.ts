import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {} from './dto/update-user.dto';
import { OutputUserDto } from './dto/output-user.dto';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AuthGuard } from '../auth/auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
    type: OutputUserDto,
  })
  @ApiResponse({ status: 422, description: 'Unaprocessable Entity' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const response = await this.userService.create(createUserDto);
    return new OutputUserDto(response);
  }

  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: OutputUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const response = await this.userService.findOne(+id);
    return new OutputUserDto(response);
  }

  @MessagePattern({ role: 'user', cmd: 'get' })
  async findUserByMail(data: { email: string }) {
    try {
      const response = await this.userService.findByMail(data.email);
      return new OutputUserDto(response);
    } catch (e) {
      throw new RpcException('Error getting user: ' + e.message);
    }
  }
}
