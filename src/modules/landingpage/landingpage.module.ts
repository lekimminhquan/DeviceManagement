import { Module } from "@nestjs/common";
import { LandingpageController } from "./landingpage.controller";
import { LandingpageService } from "./ladingpage.service";

@Module({
    controllers: [LandingpageController],
    providers: [LandingpageService],
})
export class LandingpageModule {}
