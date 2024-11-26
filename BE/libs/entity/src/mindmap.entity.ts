import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User, Node } from '.';

@Entity('mindmap')
export class Mindmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'ai_content', type: 'text' })
  aiContent: string;

  @Column({ name: 'ai_count' })
  aiCount: number;

  @ManyToOne(() => User, (user) => user.mindmaps, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'connection_id' })
  connectionId: string;

  @Column({ name: 'root_node_id' })
  rootNodeId: number;

  @OneToMany(() => Node, (node) => node.mindmap)
  nodes: Node[];

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_date' })
  modifiedDate: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
