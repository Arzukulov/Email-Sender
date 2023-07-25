import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn, } from "typeorm";

import { SenderEmailList } from "./SenderEmailList.js"

@Entity()
export class EmailList {
    @PrimaryGeneratedColumn()
    Id: number

    @Column()
    Email: string

    @Column({default: null})
    Hash: string

    @Column('boolean', {default: false})
    BlackList: boolean

    @Column('boolean', {default: null})
    senderEmailListId: number

    @OneToOne((type) => SenderEmailList)
    @JoinColumn()
    SenderEmailList: SenderEmailList
}