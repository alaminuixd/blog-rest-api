/**
 * @copyright 2026 Alamin Khan
 * @license Apache-2.0
 */
// -----------------------------------------------------------------------------
// Node Modules
// -----------------------------------------------------------------------------
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
import type { Document } from 'mongoose';

/**
 * Create interface for the user extended from mongoose Document type
 */
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  forgotPasswordToken?: string;
  forgotPasswordExpires?: Date;
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
  };
  createdAt: Date; // <--- Add this
  updatedAt: Date; // <--- Add this (optional, but good practice)
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
      minLength: [3, 'Username must be at least 3 characters'],
      maxLength: [20, 'Username must be less than 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      maxLength: [254, 'Email must be less than 254 characters'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please add a valid email address',
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
      select: false,
    },
    forgotPasswordExpires: {
      type: Date,
      select: false,
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

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

export default model<IUser>('User', userSchema);
