import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PaginationDto } from '../shared/dtos';
import { CreateProductDto, UpdateProductDto } from './dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create-product' })
  create( @Payload() createProductDto: CreateProductDto ) {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'find-all-products' })
  findAll( @Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find-product-by-id' })
  findOne( @Payload('id', ParseIntPipe) id: number ) {
    return this.productsService.findOne(+id);
  }

  @MessagePattern({ cmd: 'update-product' })
  update(
    @Payload() updateProductDto: UpdateProductDto ) {
    return this.productsService.update( updateProductDto.id, updateProductDto );
  }

  @MessagePattern({ cmd: 'delete-product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
