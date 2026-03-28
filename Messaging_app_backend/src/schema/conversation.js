import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace id is required"],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

// Index for fast lookup of conversations by members
conversationSchema.index({ members: 1, workspaceId: 1 });

// Virtual to get the other member (useful for displaying conversation name)
conversationSchema.virtual("otherMember").get(function (currentUserId) {
  return this.members.find(
    (member) => member.toString() !== currentUserId.toString(),
  );
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
