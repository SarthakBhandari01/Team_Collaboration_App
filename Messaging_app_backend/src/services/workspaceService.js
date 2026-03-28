import { StatusCodes } from "http-status-codes";
import uuid4 from "uuid4";

import transporter from "../config/mailConfig.js";
import { FRONTEND_URL, MAIL_ID } from "../config/serverConfig.js";
import channelRepository from "../repositories/channelRepository.js";
import userRepository from "../repositories/userRepository.js";
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from "../utils/errors/clientError.js";
import validationError from "../utils/errors/validationError.js";
import { createNotification } from "./notificationService.js";

export const isUserAdminOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find((member) => {
    return (
      (member.memberId.toString() === userId ||
        member.memberId._id.toString() === userId) &&
      member.role === "admin"
    );
  });
  return response;
};

export const isUserMemberOfWorkspace = (workspace, userId) => {
  const response = workspace.members.find((member) => {
    return member.memberId._id.toString() === userId;
  });
  return response;
};

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuid4().substring(0, 6).toUpperCase();
    const workspace = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode,
      members: [],
      channels: [],
    });
    //add owner
    await workspaceRepository.addMemberToWorkspace(
      workspace._id,
      workspaceData.owner,
      "admin"
    );

    //add channel
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      workspace._id,
      "general"
    );

    return updatedWorkspace;
  } catch (error) {
    if (error.name === "ValidationError") {
      throw new validationError({ error: error.errors }, error.message);
    }

    if (error.name === "MongoServerError" && error.code === 11000) {
      throw new validationError(
        {
          error: ["Workspace with same name already exists"],
        },
        "Workspace with same name already exists"
      );
    }

    throw error;
  }
};

export const getAllWorkspacesUserIsMemberOfService = async (userId) => {
  try {
    const workspaces = await workspaceRepository.findAllWorkspaceByMemberId(
      userId
    );
    return workspaces;
  } catch (error) {
    console.log(" Get workspace user is member service error ", error);
    throw error;
  }
};

export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Invalid data sent from the client",
        explaination: " Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isAllowed = isUserAdminOfWorkspace(workspace, userId);
    if (isAllowed) {
      await channelRepository.deleteMany(workspace.channels);

      const response = await workspaceRepository.delete(workspaceId);
      return response;
    }

    throw new ClientError({
      message: "User is not allowed to delete the workspace ",
      explaination: "Invalid data sent from the client ",
      statusCode: StatusCodes.UNAUTHORIZED,
    });
  } catch (error) {
    console.log("Delete workspace service  error ", error);
    throw error;
  }
};

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        message: "User is not member of the  workspace",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
    return workspace;
  } catch (error) {
    console.log("Get Workspace Service error ", error);
    throw error;
  }
};

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceByJoinCode(
      joinCode
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isMember = isUserMemberOfWorkspace(workspace, userId);

    if (!isMember) {
      throw new ClientError({
        message: "User is not member of the  workspace",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }
    return workspace;
  } catch (error) {
    console.log("Get Workspace by joinCode Service error ", error);
    throw error;
  }
};

export const updateWorkspaceService = async (
  workspaceId,
  workspaceData,
  userId
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explaination: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    //check for user
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to delete the workspace ",
        explaination: "Invalid data sent from the client ",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    //update workspace
    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      workspaceData
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("update Workspace Service error ", error);
    throw error;
  }
};

export const resetWorkspaceJoinCodeService = async (workspaceId, userId) => {
  try {
    const newJoinCode = uuid4().substring(0, 6).toUpperCase();
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      {
        joinCode: newJoinCode,
      },
      userId
    );
    return updatedWorkspace;
  } catch (error) {
    console.log("Reset Workspace join code service error ", error);
    throw error;
  }
};

export const addMemberToWorkspaceService = async (
  workspaceId,
  memberId,
  userId,
  role
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "User is not allowed to add member to workspace",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const response = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      memberId,
      role
    );
    return response;
  } catch (error) {
    console.log("Add member to workspace Service error ", error);
    throw error;
  }
};

export const addChannelToWorkspaceService = async (
  workspaceId,
  userId,
  channelName
) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(workspaceId);
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        explanation: "User is not an admin of the workspace",
        message: "User is not an admin of the workspace",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const response = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    );

    // Get the user who created the channel
    const creator = await userRepository.getById(userId);

    // Notify all workspace members about the new channel
    for (const member of workspace.members) {
      const memberId = member.memberId._id || member.memberId;
      if (memberId.toString() !== userId.toString()) {
        await createNotification(
          memberId,
          workspaceId,
          "channel_created",
          "New channel created",
          `#${channelName} was created in ${workspace.name} by ${creator?.username || "someone"}`,
          { channelName, creatorId: userId, creatorName: creator?.username }
        );
      }
    }

    return response;
  } catch (error) {
    console.log("Add channel to workspace Service error ", error);
    throw error;
  }
};

export const joinWorkspaceService = async (workspaceId, joinCode, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Workspace not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    if (workspace.joinCode !== joinCode) {
      throw new ClientError({
        explanation: "Invalid data sent from the client",
        message: "Invalid join code",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      workspaceId,
      userId,
      "member"
    );

    // Get the user who joined
    const joiningUser = await userRepository.getById(userId);

    // Notify all admins that a new member joined
    const admins = workspace.members.filter((m) => m.role === "admin");
    for (const admin of admins) {
      const adminId = admin.memberId._id || admin.memberId;
      if (adminId.toString() !== userId.toString()) {
        await createNotification(
          adminId,
          workspaceId,
          "member_joined",
          "New member joined",
          `${joiningUser?.username || "Someone"} joined ${workspace.name}`,
          { memberId: userId, memberName: joiningUser?.username }
        );
      }
    }

    return updatedWorkspace;
  } catch (error) {
    console.log("join workspace Service error", error);
    throw error;
  }
};

export const sendInviteEmailService = async (workspaceId, email, userId) => {
  try {
    const workspace = await workspaceRepository.getWorkspaceDetailsById(
      workspaceId
    );
    if (!workspace) {
      throw new ClientError({
        message: "Workspace not found",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if (!isAdmin) {
      throw new ClientError({
        message: "Only admins can send invite emails",
        explanation: "Invalid data sent from the client",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const inviter = await userRepository.getById(userId);
    const joinLink = `${FRONTEND_URL}/workspaces/join/${workspaceId}`;

    const mailOptions = {
      from: `"Team Collaboration" <${MAIL_ID}>`,
      to: email,
      subject: `You're invited to join ${workspace.name} on Team Collaboration!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #611f69 0%, #4a154b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #611f69; color: white; padding: 14px 35px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
            .code-box { background: #e0e0e0; padding: 15px; border-radius: 4px; font-size: 24px; font-weight: bold; letter-spacing: 3px; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>You're Invited! 🎉</h1>
            </div>
            <div class="content">
              <p>Hi there!</p>
              <p><strong>${inviter?.username || "Someone"}</strong> has invited you to join the workspace <strong>${workspace.name}</strong> on Team Collaboration.</p>
              <p>Use the join code below on the join page:</p>
              <div class="code-box">${workspace.joinCode}</div>
              <p style="text-align: center;">
                <a href="${joinLink}" class="button">Go to Join Page</a>
              </p>
              <p style="font-size: 12px; color: #666;">If you don't have an account yet, you'll need to sign up first, then use the link above to join.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Team Collaboration. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Create notification for the inviter
    await createNotification(
      userId,
      workspaceId,
      "workspace_invite",
      "Invite sent",
      `Invitation sent to ${email} for ${workspace.name}`,
      { email }
    );

    return { success: true, email };
  } catch (error) {
    console.log("Send invite email service error:", error);
    throw error;
  }
};
