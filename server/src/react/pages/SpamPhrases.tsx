import { type FC } from "react"
import { Setting } from "../../settings/types"
import { BanEditor } from "../components/BanEditor"

export const SpamPhrases: FC = () => {
  return (
    <BanEditor
      title="Spam phrases"
      settingKey={Setting.SpamPhrases}
      placeholder="Enter one phrase per line"
    >
      <ul className="list-disc ml-4">
        <li className="mb-2">
          New comments containing these phrases will be automatically marked for
          moderation.
        </li>
        <li className="mb-2">The phrases are case-insensitive.</li>
        <li className="mb-2">
          Be cautious when adding common phrases to avoid over-filtering.
        </li>
      </ul>
    </BanEditor>
  )
}
