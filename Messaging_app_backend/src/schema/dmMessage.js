import mongoose from "mongoose";

const dmMessageSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      default: "",
    },
    image: {
      type: String,
    },
    fileUrl: {
      type: String,
    },
    fileType: {
      type: String,
      enum: ["image", "video", "document"],
    },
    fileName: {
      type: String,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: [true, "Conversation Id is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender id is required"],
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace id is required"],
    },
  },
  { timestamps: true },
);

// Index for fast retrieval of messages by conversation
dmMessageSchema.index({ conversationId: 1, createdAt: -1 });

// Text index for full-text search on message body
dmMessageSchema.index({ body: "text" });

const DMMessage = mongoose.model("DMMessage", dmMessageSchema);

export default DMMessage;
