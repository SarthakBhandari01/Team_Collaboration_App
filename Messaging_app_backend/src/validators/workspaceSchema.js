import z from "zod";

export const workspaceSchema = z.object({
  name: z.string().min(3),
});

export const addChannelToWorkspaceSchema = z.object({
  channelName: z.string().min(1),
});

export const addMemberToWorkspaceSchema = z.object({
  memberId: z.string().min(1),
});
