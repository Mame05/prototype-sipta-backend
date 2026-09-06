import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '../dto/update-order-status.dto';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nomClient: string;

  @Column({ length: 30 })
  telephone: string;

  @Column({ length: 150 })
  email: string;

  @Column({ type: 'text' })
  adresse: string;

  @Column({ type: 'integer' })
  total: number;

  @Column({
  type: 'enum',
  enum: OrderStatus,
  default: OrderStatus.EN_ATTENTE,
})
statut: OrderStatus;

  @OneToMany(
  () => OrderItem,
  (orderItem) => orderItem.order,
)
items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}