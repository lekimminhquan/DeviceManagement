import { IsNotEmpty } from "class-validator";

export class titlePageDto {
    id?: number;
    @IsNotEmpty()
    title: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    page: string;
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
    titlePage: titlePageDto;
    @IsNotEmpty()
    selectCards: selectCardDto[];
}



