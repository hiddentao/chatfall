import { type FC } from "react"

export const Home: FC = () => {
  //   const { store } = useGlobalContext()
  //   const { getSettings } = store.useStore()

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">General Settings</h2>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Flag all comments for moderation</span>
          {/* <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={settings.flagAllComments}
            onChange={handleFlagAllCommentsChange}
          /> */}
        </label>
      </div>
    </div>
  )
}
