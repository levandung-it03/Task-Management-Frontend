import { CircleHelp } from "lucide-react"
import "./page.scss"

export default function HelpContainer({ title, description }: { title?: string, description?: string }) {
  return <div className="dc-desc-wrapper">
    {title}
    <CircleHelp className="dc-help-icon" />
    <i className="dc-help-container">{description}</i>
  </div>
}