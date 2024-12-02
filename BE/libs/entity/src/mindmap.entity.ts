import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserMindmapRole } from './user.mindmap.role';
import { Node } from './node.entity';

@Entity('mindmap')
export class Mindmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, default: '제목없음' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'ai_content', type: 'text' })
  aiContent: string;

  @Column({ name: 'ai_count', default: 5 })
  aiCount: number;

  @OneToMany(() => UserMindmapRole, (userMindmapRole) => userMindmapRole.mindmap, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userMindmapRoles: UserMindmapRole[];

  @Column({ name: 'connection_id' })
  connectionId: string;

  @OneToMany(() => Node, (node) => node.mindmap, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  nodes: Node[];

  @CreateDateColumn({ type: 'timestamp', name: 'create_date' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'modified_date' })
  modifiedDate: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
