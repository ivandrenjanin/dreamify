import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { DreamType } from '../enums/dream-type.enum';

@Entity()
export class Dream {
  @PrimaryGeneratedColumn()
  public readonly id!: number;

  @CreateDateColumn({
    name: 'date',
    type: 'timestamp without time zone',
  })
  public date!: Date;

  @Column({
    name: 'title',
    type: String,
    nullable: false,
  })
  public title!: string;

  @Column({
    name: 'description',
    type: String,
    nullable: false,
  })
  public description!: string;

  @Column({
    type: 'enum',
    nullable: false,
    name: 'type',
    enum: DreamType,
    enumName: 'type',
  })
  public type!: DreamType;
}
