```typescript
import RegisterForm from "./register.form"

export default function FormsWrapper() {
  return <>
    <button
      className={formSelection === "2" ? "tab active" : "tab"}
      onClick={() => handleSelect("2")}
    >
      Sign Up
    </button>
  </>
}

function SelectedTitle({ selection }: { selection: string }): JSX.Element {
  switch (selection) {
    case "2":
      return (
        <div className="register-title form-wrapper-title">
          <h1>Welcome, New User</h1>
          <p>Let’s follow these steps to set up your account.</p>
        </div>
      );
  }
}

function SelectedForm({ selection }: { selection: string }): JSX.Element {
  switch (selection) {
    case "2":
      return <RegisterForm />;
  }
}

```