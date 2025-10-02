import { Controller, HttpCode, HttpStatus, Body, Get } from "@nestjs/common";
import { TaxCodeService } from "./taxcode.service";
import { GetTaxCodeInfoDto } from "./dto/taxcode.dto";

@Controller('tax-code')
export class TaxCodeController {
    constructor(private readonly taxCodeService: TaxCodeService) {}

    @Get('info')
    @HttpCode(HttpStatus.OK)
    async getTaxCodeInfo(@Body() body: GetTaxCodeInfoDto) {
        return this.taxCodeService.getTaxCodeInfo(body.mst);
    }
}