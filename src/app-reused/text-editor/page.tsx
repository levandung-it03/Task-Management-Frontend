'use client'

import { useCallback, useRef } from "react"
import "./page.scss"

export function TextEditor({state, setState}: {
  state: string,
  setState: React.Dispatch<React.SetStateAction<string>>,
  
}) {
  const textEditorRef = useRef<HTMLTextAreaElement>(null)
  const onChangeValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(e.target.value)
  }, [setState])

  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textEditorRef.current
    if (!textarea)
      return

    const { selectionStart, selectionEnd, value } = textarea
    const tabContent = "    "
    if (e.key === "Tab") {
      e.preventDefault()
      document.execCommand("insertText", false, tabContent) //--Use execCommand to preserve undo stack
    } else if (e.key === "Backspace") {
      const beforeCursor = value.slice(0, selectionStart)
      if (beforeCursor.endsWith(tabContent)) {
        e.preventDefault()
        //--Remove the last tabContent before the cursor
        const newValue = value.slice(0, selectionStart - 4) + value.slice(selectionEnd)
        setState(newValue)
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart - 4
        })
      }
    }
  }, [setState])
  
  return <textarea
    id="textEditor"
    ref={textEditorRef}
    value={state}
    onChange={onChangeValue}
    placeholder="[Tab] for x4 Space, [Backspace] can delete x4 Space"
    onKeyDown={onKeyDown}
    className="desc-textarea"></textarea>
}