import combineContext from "@/utils/combineContext";

import { AuthContextProvider } from "./AuthContext";
import { ChannelMessagesProvider } from "./ChannelMessages";
import { ConversationMessagesProvider } from "./ConversationMessages";
import { CreateChannelContextProvider } from "./CreateChannelContext";
import { CreateWorkspaceContextProvider } from "./CreateWorkspaceContext";
import { SocketContextProvider } from "./SocketContext";
import { WorkspaceContextProvider } from "./WorkspaceContext";
import { WorkspacePreferencesModalContextProvider } from "./WorkspacePreferencesModalContext";

export const AppContextProvider = combineContext(
  ChannelMessagesProvider,
  ConversationMessagesProvider,
  SocketContextProvider,
  AuthContextProvider,
  WorkspaceContextProvider,
  CreateWorkspaceContextProvider,
  WorkspacePreferencesModalContextProvider,
  CreateChannelContextProvider,
);
