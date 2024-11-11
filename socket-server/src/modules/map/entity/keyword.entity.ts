import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  keyword: string;

  @Column({ name: 'location_x', type: 'float' })
  locationX: number;

  @Column({ name: 'location_y', type: 'float' })
  locationY: number;

  @Column({ type: 'tinyint' })
  depth: number;

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_date' })
  modifiedDate: Date;

  @ManyToOne(() => Keyword, (keyword) => keyword.children, { nullable: true })
  parent: Keyword;

  @OneToMany(() => Keyword, (keyword) => keyword.parent)
  children: Keyword[];
}
