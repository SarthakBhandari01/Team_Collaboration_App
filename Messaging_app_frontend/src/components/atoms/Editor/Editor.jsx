import "quill/dist/quill.snow.css";

import { Loader2, Paperclip } from "lucide-react";
import Quill from "quill";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";

import { Button } from "@/components/ui/button";

import { Hint } from "../Hint/Hint";

export const Editor = ({
  onSubmit,
  hasAttachment = false,
  onAttachClick,
  isUploading = false,
}) => {
  const containerRef = useRef();
  const quillRef = useRef();
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleSubmit = useCallback(() => {
    const text = quillRef.current?.getText()?.trim();
    if (!text && !hasAttachment) return;

    const messageContent = JSON.stringify(quillRef.current?.getContents());
    onSubmit({ body: text ? messageContent : "" });
    quillRef.current?.setText("");
    setIsEmpty(true);
  }, [onSubmit, hasAttachment]);

  function toggleToolbar() {
    setIsToolbarVisible(!isToolbarVisible);
    const toolbar = containerRef.current.querySelector(".ql-toolbar");
    if (toolbar) {
      toolbar.classList.toggle("hidden");
    }
  }
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );
    const option = {
      theme: "snow",
      modules: {
        toolbar: [
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          ["clean"],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                const text = quillRef.current?.getText()?.trim();
                if (text) {
                  handleSubmit();
                }
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quillRef.current?.insertText(
                  quillRef.current?.getSelection()?.index || 0,
                  "\n",
                );
              },
            },
          },
        },
      },
    };
    const quill = new Quill(editorContainer, option);
    quillRef.current = quill;
    quillRef.current.focus();

    // Track empty state
    quill.on("text-change", () => {
      const text = quill.getText()?.trim();
      setIsEmpty(!text);
    });

    // Cleanup on unmount
    return () => {
      quillRef.current = null;
      container.innerHTML = "";
    };
  }, [handleSubmit]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col border border-slate-500 rounded-md overflow-hidden  focus-within:shadow-sm focus-within:border-slate-400 bg-white">
        <div className="h-full" ref={containerRef} />
        <div className="flex items-center gap-1 px-2 pb-2">
          <Hint label={!isToolbarVisible ? "Show Toolbar" : "Hide Toolbar"}>
            <Button
              variant="ghost"
              size="iconSm"
              disabled={false}
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>

          {/* Attachment button - inside toolbar */}
          {onAttachClick && (
            <Hint label="Attach file">
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isUploading}
                onClick={onAttachClick}
              >
                {isUploading ? (
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  <Paperclip className="size-4 text-muted-foreground" />
                )}
              </Button>
            </Hint>
          )}

          <Hint label="Send Message">
            <Button
              size="iconSm"
              onClick={handleSubmit}
              disabled={(isEmpty && !hasAttachment) || isUploading}
              className="ml-auto bg-[#007a6a] hover:bg-[#007a6a]/80 text-white disabled:opacity-50"
            >
              <MdSend className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
      <p className="p-2 text-[10px] text-muted-foreground flex justify-end">
        <strong>Enter</strong> &nbsp; to send, &nbsp;
        <strong>Shift + Enter</strong> &nbsp; for new line
      </p>
    </div>
  );
};
