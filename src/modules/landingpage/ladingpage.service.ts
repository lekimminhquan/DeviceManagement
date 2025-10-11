import { Injectable } from '@nestjs/common';
import { contentPageDto, metaDataDto } from './dto/content';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LandingpageService {
  constructor(private readonly prisma: PrismaService) {}

  async getLandingPageContent(page: string) {
    const metadata = await this.prisma.metaData.findFirst({
      where: { page: page },
    });
    const content = await this.prisma.card.findMany({ where: { page: page } });
    return {
      metadata: metadata,
      contentCards: content,
    };
  }

  async createAndUpdateContentLandingPage(body: contentPageDto, page: string) {
    try {
      await this.prisma.$transaction(async (context) => {
        const metadata: metaDataDto = {
          backgroundImage: body.metadata.backgroundImage,
          title: body.metadata.title,
          description: body.metadata.description,
          page: page,
        };

        await Promise.all([
          body.metadata?.id
            ? await context.metaData.update({
                where: { id: body.metadata.id },
                data: metadata,
              })
            : await context.metaData.create({ data: metadata }),
        ]);

        await Promise.all(
          body.selectCards.map(async (item) => {
            const data = {
              title: item.title,
              description: item.description,
              page: page,
              icon: item.icon,
              content: item.content,
              image: item.image,
              backgroundColor: item.backgroundColor,
              numericalOrder: item.numericalOrder,
            };

            return item?.id
              ? await context.card.update({
                  where: { id: item.id },
                  data,
                })
              : await context.card.create({ data });
          }),
        );
      });

      return {
        code: 200,
        status: 'success',
        message: 'Thành công',
      };
    } catch (error) {
      return {
        code: 500,
        status: 'error',
        message: error.message,
      };
    }
  }

  // async changeContentType1(body: contentPageDto) {
  //     await this.prisma.$transaction(async (context) => {
  //         await context.selectCard.updateMany({
  //             where: { id: { in: body.selectCards.map(item => item.id) } },
  //             data: body.selectCards.map(item => ({
  //                 title: item.title,
  //                 description: item.description,
  //                 page: item.page,
  //                 image: item.image,
  //                 backgroundColor: item.backgroundColor,
  //                 numericalOrder: item.numericalOrder,
  //             })),
  //         });
  //         await context.titlePage.updateMany({
  //             where: { id: { in: body.titlePage.map(item => item.id) } },
  //             data: body.titlePage.map(item => ({
  //                 title: item.title,
  //                 description: item.description,
  //                 page: item.page,
  //             })),
  //         });
  //     });
  //     return {
  //         code: 200,
  //         status: 'success',
  //         message: 'Cập nhật thành công',
  //     };
  // }
}
