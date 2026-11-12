/**
 * @copyright 2026 alamin khan
 * @license Apache-2.0
 */

// -----------------------------------------------------------------------------
// Node modules
// -----------------------------------------------------------------------------
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type { Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
}

/**
 * User schema
 */
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'User name is required'],
      maxLength: [20, 'User must be less than 20 characters'],
      minLength: [3, "User name can't be less than 3 characters"],
      unique: true, // Note: unique takes a boolean, error messages for unique are handled by mongoose duplicate key error codes (11000)
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [50, 'Email must be less than 50 characters'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not supported',
      },
      default: 'user',
    },
    firstName: {
      type: String,
      trim: true,
      maxLength: [20, 'First name must be less than 20 characters'],
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [20, 'Last name must be less than 20 characters'],
    },
    socialLinks: {
      website: {
        type: String,
        trim: true,
        maxLength: [100, 'Website address must be less than 100 characters'],
      },
      facebook: {
        type: String,
        trim: true,
        maxLength: [100, 'Facebook profile must be less than 100 characters'],
      },
      instagram: {
        type: String,
        trim: true,
        maxLength: [100, 'Instagram profile must be less than 100 characters'],
      },
      linkedin: {
        type: String,
        trim: true,
        maxLength: [100, 'Linkedin profile must be less than 100 characters'],
      },
      x: {
        type: String,
        trim: true,
        maxLength: [100, 'X profile must be less than 100 characters'],
      },
      youtube: {
        type: String,
        trim: true,
        maxLength: [100, 'Youtube channel must be less than 100 characters'],
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save middleware to hash password securely
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

export default model<IUser>('User', userSchema);
