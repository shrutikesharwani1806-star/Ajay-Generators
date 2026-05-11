import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sessionId: {
    type: String,
    required: true,
  },
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'bot', 'admin'],
      required: true,
    },
    message: {
      type: String,
    },
    fileUrl: String,
    fileType: {
      type: String,
      enum: ['image', 'document', 'other'],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    deletedByUser: {
      type: Boolean,
      default: false,
    },
    deletedByAdmin: {
      type: Boolean,
      default: false,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isResolved: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

chatSchema.index({ sessionId: 1 });
chatSchema.index({ user: 1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
