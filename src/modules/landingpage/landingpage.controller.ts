import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { LandingpageService } from "./ladingpage.service";
import { contentPageDto } from "./dto/content";

@Controller('landingpage')
export class LandingpageController {
  constructor(private readonly landingpageService: LandingpageService) {}

  @Get(':page')
  @HttpCode(HttpStatus.OK)
  async getLandingPageContent(@Param('page') page: string) {
    return this.landingpageService.getLandingPageContent(page);
  }

  @Post('/update/:page')
  @HttpCode(HttpStatus.OK)
  async createAndUpdateContentLandingPage(@Body() body: contentPageDto, @Param('page') page: string) {
    return this.landingpageService.createAndUpdateContentLandingPage(body, page);
  }


  // @Put('/change')
  // @HttpCode(HttpStatus.OK)
  // async changeContentLandingPageType1(@Body() body: contentPageDto) {
  //   return this.landingpageService.changeContentType1(body);
  // }
}


