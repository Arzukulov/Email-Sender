import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn, } from "typeorm";

@Entity()
export class SenderEmailList {
    @PrimaryGeneratedColumn()
    Id: number

    @Column()
    Email: string

    @Column()
    Password: string
}