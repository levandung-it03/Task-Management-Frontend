'use client'

import ReactDOM from "react-dom/client";
import { createPortal } from "react-dom";
import React, { useState } from "react";
import "./confirm-alert.scss"
import { FileQuestion } from "lucide-react"

export function confirm(message: string, title = "Confirm"): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = ReactDOM.createRoot(container);

    const ConfirmComponent = () => {
      const [visible, setVisible] = useState(true);

      const handle = (result: boolean) => {
        setVisible(false);
        resolve(result);
        setTimeout(() => {
          root.unmount();
          container.remove();
        }, 300);
      };

      if (!visible) return null;

      return createPortal(
        <div className="my-confirm-overlay">
          <div className="my-confirm-box">
            <h3 className="alert-title">
              <FileQuestion className="alert-title-icon" />
              {title}
            </h3>
            <p className="alert-msg">{message}</p>
            <div className="my-confirm-actions">
              <button className="alert-cancel-btn" onClick={() => handle(false)}>Cancel</button>
              <button className="alert-ok-btn" onClick={() => handle(true)}>OK</button>
            </div>
          </div>
        </div>,
        document.body
      );
    };

    root.render(<ConfirmComponent />);
  });
}
