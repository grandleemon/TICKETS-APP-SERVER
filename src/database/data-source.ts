import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Event } from '../events/entities/event.entity';
import { TicketType } from '../ticket-types/entities/ticket-type.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Session } from '../sessions/entities/session.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,

  entities: [User, Event, TicketType, Ticket, Session],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
});
