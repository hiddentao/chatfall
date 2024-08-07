import { Sort } from "@chatfall/server"
import { useCallback } from "react"
import { useCommentsStore } from "../shared/comments.store"

export default function CommentList() {
  const { comments, users, fetchComments, sort } = useCommentsStore()

  const handleSortChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    fetchComments(event.target.value as Sort)
  }, [])

  return (
    <section className="flex flex-col gap-2">
      <div className="flex justify-end">
        <label htmlFor="sort-select" className="mr-2">
          Sort By:
        </label>
        <select id="sort-select" value={sort} onChange={handleSortChange}>
          <option value={Sort.newest_first}>Newest first</option>
          <option value={Sort.oldest_first}>Oldest first</option>
          <option value={Sort.highest_score}>Highest rated</option>
          <option value={Sort.lowest_score}>Lowest rated</option>
          <option value={Sort.most_replies}>Most replies</option>
          <option value={Sort.least_replies}>Least replies</option>
        </select>
      </div>
      {comments.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {comments.map((c) => (
            <li key={c.id} className="block">
              <div className="flex flex-row">
                <h3 className="font-bold">{users[c.userId].username}</h3>
                <span className="text-gray-400 ml-2">{`${c.createdAt}`}</span> {/* Display the selected sorting parameter */}
                <span className="text-gray-800 ml-2">{`Rating: ${c.rating}`}</span>
              </div>
              <div>{c.body}</div>
              {c.reply_count > 0 && <div className="mt-4">{`Replies: ${c.reply_count}`}</div>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-center rounded-xl border-slate-400/40 border-2 p-3">
          No comments
        </p>
      )}
    </section>
  )
}
