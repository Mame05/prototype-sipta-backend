import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Repository, DataSource } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
    constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectDataSource()
private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const savedOrderId = await this.dataSource.transaction(
      async (manager) => {
        let total = 0;

        const orderItems: OrderItem[] = [];

        for (const item of createOrderDto.items) {
          const product = await manager.findOne(Product, {
            where: {
              id: item.productId,
            },
          });

          if (!product) {
            throw new NotFoundException(
              `Produit ${item.productId} introuvable`,
            );
          }

          if (!product.disponible) {
            throw new BadRequestException(
              `Le produit "${product.nom}" n'est pas disponible`,
            );
          }

          if (item.quantity > product.stock) {
            throw new BadRequestException(
              `Stock insuffisant pour "${product.nom}"`,
            );
          }

          const sousTotal = product.prix * item.quantity;

          total += sousTotal;

          // Diminution du stock
          product.stock -= item.quantity;

          // Si le stock arrive à 0
          if (product.stock === 0) {
            product.disponible = false;
          }

          await manager.save(Product, product);

          const orderItem = manager.create(OrderItem, {
            productId: product.id,
            product,
            quantity: item.quantity,
            prixUnitaire: product.prix,
            sousTotal,
          });

          orderItems.push(orderItem);
        }

        const order = manager.create(Order, {
          nomClient: createOrderDto.nomClient,
          telephone: createOrderDto.telephone,
          email: createOrderDto.email,
          adresse: createOrderDto.adresse,
          total,
        });

        const savedOrder = await manager.save(Order, order);

        for (const orderItem of orderItems) {
          orderItem.orderId = savedOrder.id;
          orderItem.order = savedOrder;
        }

        await manager.save(OrderItem, orderItems);

        return savedOrder.id;
      },
    );

    return this.findOne(savedOrderId);
  }

  async findAll(): Promise<Order[]> {
  return this.orderRepository.find({
    relations: {
      items: {
        product: true,
      },
    },
    order: {
      id: 'DESC',
    },
  });
}

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        items: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    return order;
  }
  async updateStatus(
  id: number,
  statut: OrderStatus,
): Promise<Order> {
  const order = await this.findOne(id);

  order.statut = statut;

  await this.orderRepository.save(order);

  return this.findOne(id);
}
}
