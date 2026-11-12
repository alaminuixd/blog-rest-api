/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { Schema, model, Types } from 'mongoose';

interface IToken {
  token: string;
  userId: Types.ObjectId;
}

const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

export default model<IToken>('Token', tokenSchema);
