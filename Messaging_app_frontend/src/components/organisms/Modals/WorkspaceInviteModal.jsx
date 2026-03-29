import { CopyIcon, MailIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useResetJoinCode } from "@/hooks/apis/workspaces/useResetJoinCode";
import { useSendInviteEmail } from "@/hooks/apis/workspaces/useSendInviteEmail";
import { useToast } from "@/hooks/use-toast";

export const WorkspaceInviteModal = ({
  openInviteModal,
  joinCode,
  workspaceName,
  setOpenInviteModal,
  workspaceId,
}) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { resetJoinCodeMutation } = useResetJoinCode(workspaceId);
  const { sendInviteEmailMutation, isPending: isSending } =
    useSendInviteEmail(workspaceId);

  async function handleCopy() {
    const textToCopy = joinCode;
    await navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Code copied to clipboard",
      type: "success",
    });
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}/workspaces/join/${workspaceId}`;
    await navigator.clipboard.writeText(link);
    toast({
      title: "Invite link copied to clipboard",
      type: "success",
    });
  }

  async function handleResetCode() {
    try {
      await resetJoinCodeMutation();
      toast({
        type: "success",
        title: "Join code reset successfully",
      });
    } catch (error) {
      console.log("Error in resetting join code", error);
    }
  }

  async function handleSendEmail(e) {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const data = await sendInviteEmailMutation(email);
      
      if (data?.emailSent) {
        toast({
          title: "Invite sent!",
          description: `Invitation email sent to ${email}`,
          type: "success",
        });
      } else {
        // Email service unavailable, show join code to share manually
        toast({
          title: "Email unavailable",
          description: data?.message || `Share join code ${joinCode} with ${email} manually`,
          type: "default",
        });
      }
      setEmail("");
    } catch (error) {
      toast({
        title: "Failed to send invite",
        description: error?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={openInviteModal} onOpenChange={setOpenInviteModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite people to {workspaceName}</DialogTitle>
          <DialogDescription>
            Send an email invitation or share the join code.
          </DialogDescription>
        </DialogHeader>

        {/* Email Invite Section */}
        <form onSubmit={handleSendEmail} className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
              disabled={isSending}
            />
            <Button type="submit" disabled={isSending || !email.trim()}>
              <MailIcon className="size-4 mr-2" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or share the code
            </span>
          </div>
        </div>

        {/* Join Code Section */}
        <div className="flex flex-col items-center gap-y-3">
          <p className="font-bold text-3xl tracking-widest">{joinCode}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              <CopyIcon className="size-4 mr-2" />
              Copy code
            </Button>
            <Button size="sm" variant="outline" onClick={handleCopyLink}>
              <CopyIcon className="size-4 mr-2" />
              Copy link
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button size="sm" variant="ghost" onClick={handleResetCode}>
            <RefreshCcwIcon className="size-4 mr-2" />
            Reset Join Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
