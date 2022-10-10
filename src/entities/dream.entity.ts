import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as Base,
} from 'typeorm';
import { DreamType } from '../enums/dream-type.enum';

export class Dream extends Base {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @ApiProperty()
  @CreateDateColumn({
    name: 'date',
    type: 'timestamp without time zone',
  })
  public date!: Date;

  @ApiProperty()
  @Column({
    name: 'title',
    type: String,
    nullable: false,
  })
  public title!: string;

  @ApiProperty()
  @Column({
    name: 'description',
    type: String,
    nullable: false,
  })
  public description!: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    nullable: false,
    name: 'type',
    enum: DreamType,
    enumName: 'type',
  })
  public type!: DreamType;
}
