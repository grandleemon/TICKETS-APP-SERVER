import { Module } from '@nestjs/common';
import { TicketTypesService } from './ticket-types.service';
import { TicketTypesController } from './ticket-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketType } from './entities/ticket-type.entity';

@Module({
  controllers: [TicketTypesController],
  providers: [TicketTypesService],
  imports: [TypeOrmModule.forFeature([TicketType])],
})
export class TicketTypesModule {}
