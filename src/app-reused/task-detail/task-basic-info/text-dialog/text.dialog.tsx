import { ScrollText, X } from "lucide-react";

import "./text.dialog.scss"
import { useCallback, useEffect, useRef, useState } from "react";
import { TextEditor } from "@/app-reused/text-editor/text-editor";
import { confirm } from "@/app-reused/confirm-alert/confirm-alert";

interface TextDialogProps {
  onSubmitUpdateContent: (content: string) => void;
  title: string;
  inpContent: string;
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  isOwner: boolean
}

export default function TextDialog({
  onSubmitUpdateContent,
  title,
  inpContent,
  openDialog,
  setOpenDialog,
  isOwner
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

  const onClickUpdate = useCallback(() => {
    async function update() {
      if (await confirm("This change cannot be undone. Are you sure?", "Confirm Updating"))
        onSubmitUpdateContent(content)
    }
    update()
  }, [content, onSubmitUpdateContent])

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
        <TextEditor state={content} setState={setContent} />
        {isOwner
          ? <div className="update-btn-container">
            <button className="update-content-btn" onClick={onClickUpdate} >
              Submit Update
            </button>
          </div>
          : <></>}
      </div>
    </div>
    : <></>
}