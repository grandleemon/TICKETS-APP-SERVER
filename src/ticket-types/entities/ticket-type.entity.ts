import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('ticket_type')
@Check('"maxNumber" > 0')
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column()
  title: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  price: string;

  @Column()
  maxNumber: number;

  @Column({ default: 0 })
  reservedNumber: number;

  @ManyToOne(() => Event, (event) => event.ticketTypes, {
    nullable: false,
  })
  event: Event;

  @OneToMany(() => Ticket, (ticket) => ticket.ticketType)
  tickets: Ticket[];
}
