"use client"

import { JSX, useCallback, useState } from "react"
import LoginForm from "./login.form"
import ForgotPassForm from "./forgot-pass.form"

export default function FormsWrapper() {
  const [formSelection, setFormSelection] = useState("1");

  const handleSelect = useCallback((value: string) => {
    setFormSelection(value);
  }, []);

  return (
    <>
      <SelectedTitle selection={formSelection} />
      <div className="form-tab-buttons">
        <button
          className={formSelection === "1" ? "tab active" : "tab"}
          onClick={() => handleSelect("1")}
        >
          Sign In
        </button>
        <button
          className={formSelection === "2" ? "tab active" : "tab"}
          onClick={() => handleSelect("2")}
        >
          Lost Password
        </button>
      </div>
      <SelectedForm selection={formSelection} />
    </>
  );
}

function SelectedTitle({ selection }: { selection: string }): JSX.Element {
  switch (selection) {
    case "1":
      return (
        <div className="login-title form-wrapper-title">
          <h1>Welcome Back</h1>
          <p>Welcome back! Please enter your details.</p>
        </div>
      );
    case "2":
      return (
        <div className="forgot-pass-title form-wrapper-title">
          <h1>Forgot Password</h1>
          <p>Let us help you reset your password.</p>
        </div>
      );
    default:
      return <></>;
  }
}

function SelectedForm({ selection }: { selection: string }): JSX.Element {
  switch (selection) {
    case "1":
      return <LoginForm />;
    case "2":
      return <ForgotPassForm />;
    default:
      return <></>;
  }
}
