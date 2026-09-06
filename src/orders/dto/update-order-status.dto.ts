import { IsEnum } from 'class-validator';

export enum OrderStatus {
  EN_ATTENTE = 'en_attente',
  CONFIRMEE = 'confirmee',
  LIVREE = 'livree',
  ANNULEE = 'annulee',
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  statut: OrderStatus;
}