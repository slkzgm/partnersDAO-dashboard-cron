// /src/models/tweet.models.ts
import mongoose, { Schema, Document } from "mongoose";
import * as Mongoose from "mongoose";

interface Mention {
  id?: string;
  username?: string;
  name?: string;
}

interface Photo {
  id?: string;
  url?: string;
}

interface Video {
  id?: string;
  preview?: string;
  url?: string;
}

const MentionSchema = new Schema<Mention>(
  {
    id: { type: String },
    username: { type: String },
    name: { type: String },
  },
  { _id: false }
);

const PhotoSchema = new Schema<Photo>(
  {
    id: { type: String },
    url: { type: String },
  },
  { _id: false }
);

const VideoSchema = new Schema<Video>(
  {
    id: { type: String },
    preview: { type: String },
    url: { type: String },
  },
  { _id: false }
);

/**
 * Interface principale pour le document Tweet
 */
export interface TweetDoc extends Document {
  bookmarkCount?: number;
  conversationId?: string;
  id?: string;
  idNumeric: Mongoose.Types.Decimal128;
  hashtags?: string[];
  likes?: number;
  mentions?: Mention[];
  name?: string;
  permanentUrl?: string;
  photos?: Photo[];
  replies?: number;
  retweets?: number;
  text?: string;
  thread?: any[];
  urls?: string[];
  userId?: string;
  username?: string;
  videos?: Video[];
  isQuoted?: boolean;
  isReply?: boolean;
  isRetweet?: boolean;
  isPin?: boolean;
  sensitiveContent?: boolean;
  timeParsed?: Date;
  timestamp?: number;
  inReplyToStatusId?: string;
  html?: string;
  views?: number;

  quotedStatusId?: string;
  quotedStatus?: any;
  poll?: any;
  place?: any;
  retweetedStatus?: any;
  retweetedStatusId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const TweetSchema = new Schema<TweetDoc>(
  {
    bookmarkCount: { type: Number },
    conversationId: { type: String },
    id: { type: String, unique: true },
    idNumeric: { type: Schema.Types.Decimal128, index: true },
    hashtags: { type: [String], default: [] },
    likes: { type: Number },
    mentions: { type: [MentionSchema], default: [] },
    name: { type: String },
    permanentUrl: { type: String },
    photos: { type: [PhotoSchema], default: [] },
    replies: { type: Number },
    retweets: { type: Number },
    text: { type: String },
    thread: { type: [Schema.Types.Mixed], default: [] },
    urls: { type: [String], default: [] },
    userId: { type: String },
    username: { type: String },
    videos: { type: [VideoSchema], default: [] },
    isQuoted: { type: Boolean },
    isReply: { type: Boolean },
    isRetweet: { type: Boolean },
    isPin: { type: Boolean },
    sensitiveContent: { type: Boolean },
    timeParsed: { type: Date },
    timestamp: { type: Number },
    inReplyToStatusId: { type: String },
    html: { type: String },
    views: { type: Number },

    quotedStatusId: { type: String },
    quotedStatus: { type: Schema.Types.Mixed },
    poll: { type: Schema.Types.Mixed },
    place: { type: Schema.Types.Mixed },
    retweetedStatus: { type: Schema.Types.Mixed },
    retweetedStatusId: { type: String },
  },
  { timestamps: true }
);

export const TweetModel = mongoose.model<TweetDoc>("Tweet", TweetSchema);
