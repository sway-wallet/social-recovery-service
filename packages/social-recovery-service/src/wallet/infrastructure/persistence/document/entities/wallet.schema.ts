import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
import { Expose } from 'class-transformer';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';

export type WalletSchemaDocument = HydratedDocument<WalletSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class WalletSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  publicKey?: string;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  encryptedPrivateKeySeed?: string;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  previousEncryptedPrivateKeySeed?: string;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  encryptedSeed?: string;

  @Prop({
    type: String,
    unique: true,
  })
  @Expose({ groups: ['me', 'admin'], toPlainOnly: true })
  previousEncryptedSeed?: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(WalletSchemaClass);

// WalletSchema.virtual('previousEncryptedPrivateKeySeed').get(function () {
//   return this.encryptedPrivateKeySeed;
// });

// WalletSchema.virtual('previousEncryptedSeed').get(function () {
//   return this.encryptedSeed;
// });

