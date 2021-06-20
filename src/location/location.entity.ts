import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column()
  @IsString()
  user: string;

  @Column()
  @IsString()
  phone: string;

  @Column({ type: 'decimal' })
  @IsNumber()
  lat: number;

  @Column({ type: 'decimal' })
  @IsNumber()
  lon: number;
}
