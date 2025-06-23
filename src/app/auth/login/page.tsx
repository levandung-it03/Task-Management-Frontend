import Image from "next/image"
import FormsWrapper from "./forms/forms-wrapper"
import "./page.scss"

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-section">
          <FormsWrapper />
        </div>
        <div className="image-section">
          <Image src="/images/login.background.png" width={500} height={500} alt="Login illustration" className="login-image" />
        </div>
      </div>
    </div>
  )
}