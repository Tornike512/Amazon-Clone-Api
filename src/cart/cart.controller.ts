import {
  Controller,
  UseGuards,
  Req,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { CartService } from './cart.service';
import { CreateCartProduct } from './dtos/create-cart-product.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.cartService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateCartProduct, @Req() req) {
    return this.cartService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') productId: string,
    @Req() req,
    @Query('removeAll') removeAll?: boolean,
  ) {
    const userId = req.user.id;
    const removeAllFlag = !!removeAll;

    return this.cartService.delete(userId, productId, removeAllFlag);
  }
}
