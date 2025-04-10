import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('products service');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({ data: createProductDto });
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination

    const totalPage = await this.product.count();
    const lastPage = Math.ceil(totalPage / limit);

    return { data: await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit
    }),
      meta: {
        totalPage,
        page,
        lastPage
      }}
  }

  async findOne(id: number) {
    const prod = await this.product.findFirst({
      where: {
        id
      }
    });
    if (!prod) {
      throw new BadRequestException('Product not found');
    }
    return prod;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const prod = await this.findOne(id);
    if (!prod){
      throw new NotFoundException();
    }
    // resto de la logica de update
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
