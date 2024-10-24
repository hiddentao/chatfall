import { type FC } from "react"
import { Setting } from "../../settings/types"
import { BanEditor } from "../components/BanEditor"

const validateWords = (value: string): string | undefined => {
  const words = value.split("\n").filter((word) => word.trim() !== "")
  const invalidWords = words.filter((word) => !/^[\w-]+$/.test(word.trim()))

  if (invalidWords.length > 0) {
    return `Invalid word(s): ${invalidWords.join(", ")}. Words should only contain letters, numbers, underscores, or hyphens.`
  }
  return undefined
}

export const BannedWords: FC = () => {
  return (
    <BanEditor
      title="Banned words"
      settingKey={Setting.BlacklistedWords}
      validateItems={validateWords}
      placeholder="Enter one word per line"
    >
      <ul className="list-disc ml-4">
        <li className="mb-2">
          New comments containing these words will be automatically rejected.
        </li>
        <li className="mb-2">The ban list is case-insensitive.</li>
        <li className="mb-2">
          Words should only contain letters, numbers, underscores, or hyphens.
        </li>
        <li className="mb-2">
          Be cautious when adding common words to avoid over-filtering.
        </li>
      </ul>
    </BanEditor>
  )
}
