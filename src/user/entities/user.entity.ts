import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Event, (event) => event.createdByUser)
  events: Event[];

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
