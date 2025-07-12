import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';
import { PaginationDto } from '../shared/dtos';
import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }
  
  async findAll(paginationDto: PaginationDto) {
    
    const { page, limit } = paginationDto;
    const totalProducts = await this.product.count();
    const lastPage = Math.ceil(totalProducts / limit!);

    return {
      meta: {
        total_products: totalProducts,
        page: page!,
        limit: limit!, 
        lastPage: lastPage,
      },

      data: await this.product.findMany({
        skip: ( page! - 1 ) * limit!,
        take: limit!,
      }),
    }
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id },
    });

    if (!product) throw new NotFoundException(`Product with id #${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    await this.findOne(id);

    const productUpdated = await this.product.update({
      where: { id },
      data: updateProductDto,
    })

    if (!productUpdated) throw new NotFoundException(`Product with id #${id} not found`);

    return productUpdated;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
