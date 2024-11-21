import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User, Node } from '.';

@Entity('mindmap')
export class Mindmap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.mindmaps, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'root_node_id' })
  rootNodeId: number;

  @OneToMany(() => Node, (node) => node.mindmap)
  nodes: Node[];
}
