import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TicketType } from '../../ticket-types/entities/ticket-type.entity';

@Entity('ticket')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.tickets, {
    nullable: false,
  })
  user: User;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.tickets)
  ticketType: TicketType;
}
