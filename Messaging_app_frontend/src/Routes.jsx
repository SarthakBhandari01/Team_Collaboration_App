import { Navigate, Route, Routes } from "react-router-dom";

import { SigninContainer } from "@/components/organisms/auth/SigninContainer";
import { SignupContainer } from "@/components/organisms/auth/SignupContainer";
import { Auth } from "@/pages/Auth/Auth";
import { NotFound } from "@/pages/NotFound/Notfound";

import { ProtectedRoute } from "./components/molecules/ProtectedRoute/protectedRoute";
import { Home } from "./pages/Home/Home";
import { Channel } from "./pages/Workspace/Channel";
import { DirectMessage } from "./pages/Workspace/DirectMessage";
import { JoinPage } from "./pages/Workspace/JoinPage";
import { WorkspaceLayout } from "./pages/Workspace/Layout";
import { Notifications } from "./pages/Workspace/Notifications";
import { WorkspaceIndex } from "./pages/Workspace/WorkspaceIndex";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route
        path="/auth/signup"
        element={
          <Auth>
            <SignupContainer />
          </Auth>
        }
      />
      <Route
        path="/auth/signin"
        element={
          <Auth>
            <SigninContainer />
          </Auth>
        }
      />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <WorkspaceIndex />
            </WorkspaceLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId/channels/:channelId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Channel />
            </WorkspaceLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId/conversations/:conversationId"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <DirectMessage />
            </WorkspaceLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:workspaceId/notifications"
        element={
          <ProtectedRoute>
            <WorkspaceLayout>
              <Notifications />
            </WorkspaceLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/workspaces/join/:workspaceId" element={<JoinPage />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
};
