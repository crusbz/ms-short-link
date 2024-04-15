import { Controller, Get, Param, Res } from '@nestjs/common';
import { OutputShortLinkDto } from './short-link/dto/output-short-link.dto';
import { Response } from 'express';
import { ShortLinkService } from './short-link/short-link.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Redirect')
@Controller()
export class AppController {
  constructor(private readonly userService: ShortLinkService) {}

  @ApiResponse({ status: 404, description: 'Shortened link not found.' })
  @Get(':shortenedLink')
  async findOne(
    @Param('shortenedLink') shortenedLink: string,
    @Res() res: Response,
  ) {
    const response = await this.userService.findByShortenedLink(shortenedLink);
    const shortLink = new OutputShortLinkDto(response);
    return res.redirect(shortLink.targetLink);
  }
}
