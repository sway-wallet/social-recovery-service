import { Exclude } from "class-transformer";
import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('string', { unique: true, nullable: true })
  publicKey?: string;

  @Column('string', { unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  encryptedPrivateKeySeed?: string;

  @Exclude({ toPlainOnly: true })
  previousEncryptedPrivateKeySeed?: string;

  @Column('string', { unique: true, nullable: true })
  @Exclude({ toPlainOnly: true })
  encryptedSeed?: string;

  @Exclude({ toPlainOnly: true })
  previousEncryptedSeed?: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}