import { ScrollText, X } from "lucide-react";

import "./text.dialog.scss"
import { useCallback, useEffect, useRef, useState } from "react";
import { TextEditor } from "@/app-reused/text-editor/page";

interface TextDialogProps {
  onSubmitUpdateContent: (content: string) => Promise<void>;
  title: string;
  inpContent: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TextDialog({
  onSubmitUpdateContent,
  title,
  inpContent,
  openDialog,
  setOpenDialog
}: TextDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<string>("")

  useEffect(() => {
    setContent(inpContent)
  }, [inpContent])

  const onClickCloseDialog = useCallback(() => {
    setOpenDialog(false)
    setContent(inpContent)
  }, [inpContent])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        setOpenDialog(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return openDialog
    ? <div className="text-dialog">
      <div ref={overlayRef} className="dialog-overlay"></div>
      <div className="dialog-container">
        <div className="dialog-header">
          <div className="dialog-header-content">
            <ScrollText className="dhc-icon" />
            <span className="dhc-title">{title}</span>
          </div>
          <X className="close-dialog-btn" onClick={onClickCloseDialog} />
        </div>
        <TextEditor
          state={content}
          setState={setContent}
        />
        <div className="update-btn-container">
          <button
            className="update-content-btn"
            onClick={() => onSubmitUpdateContent(content)}
          >
            Submit Update
          </button>
        </div>
      </div>
    </div>
    : <></>
}