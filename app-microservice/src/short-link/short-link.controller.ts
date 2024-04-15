import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ShortLinkService } from './short-link.service';
import { CreateShortLinkDto } from './dto/create-short-link.dto';
import { UpdateShortLinkDto } from './dto/update-short-link.dto';
import {
  OutputListShortLinkDto,
  OutputShortLinkDto,
} from './dto/output-short-link.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Short Link')
@Controller('short-link')
export class ShortLinkController {
  constructor(private readonly userService: ShortLinkService) {}

  @ApiResponse({
    status: 200,
    description: 'Short Link created successfully.',
    type: OutputShortLinkDto,
  })
  @ApiResponse({ status: 422, description: 'Unaprocessable Entity' })
  @Post()
  @UseInterceptors(AuthInterceptor)
  async create(@Body() createShortLinkDto: CreateShortLinkDto) {
    const response = await this.userService.create(createShortLinkDto);
    return new OutputShortLinkDto(response);
  }

  @ApiResponse({
    status: 200,
    description: 'Found list short link by user successfully.',
    type: OutputListShortLinkDto,
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Get('user/:userId')
  async findAll(@Req() req: { userId: number }) {
    const response = await this.userService.findAll(req.userId);
    return new OutputListShortLinkDto(response);
  }

  @ApiResponse({
    status: 200,
    description: 'Short Link created successfully.',
    type: OutputShortLinkDto,
  })
  @ApiResponse({ status: 422, description: 'Unaprocessable Entity' })
  @ApiResponse({ status: 404, description: 'Short Link not found' })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShortLinkDto: UpdateShortLinkDto,
    @Req() req: { userId: number },
  ) {
    const response = await this.userService.updateTargetLinkByUser(
      +id,
      req.userId,
      updateShortLinkDto,
    );
    return new OutputShortLinkDto(response);
  }

  @ApiResponse({
    status: 200,
    description: 'Remove short link successfully.',
  })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: { userId: number }) {
    await this.userService.remove(+id, req.userId);
    return { message: 'ShortLink deleted successfully' };
  }
}
