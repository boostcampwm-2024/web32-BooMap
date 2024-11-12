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
export class Node {
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

  @ManyToOne(() => Node, (node) => node.children, { nullable: true })
  parent: Node;

  @OneToMany(() => Node, (node) => node.parent)
  children: Node[];
}
