// /src/models/user.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface UserDoc extends Document {
  avatar?: string;
  banner?: string;
  biography?: string;
  birthday?: string;
  followersCount?: number;
  followingCount?: number;
  friendsCount?: number;
  mediaCount?: number;
  statusesCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  isBlueVerified?: boolean;
  joined?: Date;
  likesCount?: number;
  listedCount?: number;
  location?: string;
  name?: string;
  pinnedTweetIds?: string[];
  tweetsCount?: number;
  url?: string;
  userId?: string;
  username?: string;
  website?: string;
  canDm?: boolean;

  eligibleTweetsCount?: number;
}

const UserSchema = new Schema<UserDoc>(
  {
    avatar: { type: String },
    banner: { type: String },
    biography: { type: String },
    birthday: { type: String },
    followersCount: { type: Number },
    followingCount: { type: Number },
    friendsCount: { type: Number },
    mediaCount: { type: Number },
    statusesCount: { type: Number },
    isPrivate: { type: Boolean },
    isVerified: { type: Boolean },
    isBlueVerified: { type: Boolean },
    joined: { type: Date },
    likesCount: { type: Number },
    listedCount: { type: Number },
    location: { type: String },
    name: { type: String },
    pinnedTweetIds: { type: [String], default: [] },
    tweetsCount: { type: Number },
    url: { type: String },
    userId: { type: String, unique: true },
    username: { type: String },
    website: { type: String },
    canDm: { type: Boolean },

    eligibleTweetsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// An index on eligibleTweetsCount if we want to query top users by that field
UserSchema.index({ eligibleTweetsCount: -1 });

export const UserModel = mongoose.model<UserDoc>("User", UserSchema);
