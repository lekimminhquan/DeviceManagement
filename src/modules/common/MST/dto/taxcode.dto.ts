import { IsNotEmpty } from "class-validator";

export class GetTaxCodeInfoDto {
    @IsNotEmpty()
    mst!: string;
}
