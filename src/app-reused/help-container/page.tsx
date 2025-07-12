import { CircleHelp } from "lucide-react"
import "./page.scss"

export default function HelpContainer({ title, description }: { title?: string, description?: string }) {
  return <div className="dc-desc-wrapper">
    <span className="dc-desc-text">{title}</span>
    <CircleHelp className="dc-help-icon" />
    <i className="dc-help-container">{description}</i>
  </div>
}