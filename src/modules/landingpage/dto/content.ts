import { IsNotEmpty } from "class-validator";


export class metaDataDto {
    id?: number;
    @IsNotEmpty()
    backgroundImage: string;
    @IsNotEmpty()
    page: string;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
}
export class selectCardDto {
    id?: number;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    icon: string;
    @IsNotEmpty()
    page: string;
    @IsNotEmpty()
    content: string;
    @IsNotEmpty()
    image: string;
    backgroundColor: string;
    numericalOrder: number;
}

export class contentPageDto {
    @IsNotEmpty()
    page: string;
    @IsNotEmpty()
    metadata: metaDataDto;
    @IsNotEmpty()
    selectCards: selectCardDto[];
}



