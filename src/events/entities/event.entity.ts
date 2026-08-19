import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { TicketType } from '../../ticket-types/entities/ticket-type.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  startTime: Date;

  @Column({
    nullable: true,
  })
  endTime: Date;

  @Column()
  place: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.events, {
    nullable: false,
  })
  createdByUser: User;

  @OneToMany(() => TicketType, (ticketType) => ticketType.event)
  ticketTypes: TicketType[];
}
