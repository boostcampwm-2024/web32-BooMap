import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Mindmap } from './mindmap.entity';

@Entity('node')
@Tree('closure-table')
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

  @DeleteDateColumn()
  deletedAt: Date | null;

  @TreeParent()
  parent: Node;

  @TreeChildren()
  children: Node[];

  @ManyToOne(() => Mindmap, (mindmap) => mindmap.nodes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mindmap_id' })
  mindmap: Mindmap;
}
