import { Module } from "@nestjs/common";
import { TaxCodeService } from "./taxcode.service";
import { TaxCodeController } from "./taxcode.controller";


@Module({
    controllers: [TaxCodeController],
    providers: [TaxCodeService],
})
export class MSTModule {}
