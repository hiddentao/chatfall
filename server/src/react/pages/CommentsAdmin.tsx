import { CommentListBase, useGlobalContext } from "@chatfall/client"
import {
  type ChangeEvent,
  type FC,
  useCallback,
  useEffect,
  useState,
} from "react"
import { CommentStatus } from "../../db/schema"
import { PageWrapper } from "../components/PageWrapper"
import type { ServerStore } from "../store/server"

export const CommentsAdmin: FC = () => {
  const { store } = useGlobalContext<ServerStore>()
  const { getCanonicalUrls } = store.useStore()

  const [status, setStatus] = useState<CommentStatus | "">("")
  const [search, setSearch] = useState("")
  const [selectedUrl, setSelectedUrl] = useState<string>("")
  const [urls, setUrls] = useState<string[] | undefined>()

  const fetchUrlsList = useCallback(async () => {
    try {
      const result = await getCanonicalUrls()
      setUrls(result)
    } catch (error) {
      console.error("Error fetching URLs:", error)
    }
  }, [getCanonicalUrls])

  useEffect(() => {
    fetchUrlsList()
  }, [fetchUrlsList])

  const handleStatusChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setStatus(event.target.value as CommentStatus | "")
    },
    [],
  )

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value)
    },
    [],
  )

  const handleUrlChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      setSelectedUrl(event.target.value)
    },
    [],
  )

  return (
    <PageWrapper title="Comments Admin">
      {!urls ? (
        <div className={"flex flex-row justify-center items-center w-full"}>
          <div className="skeleton h-32 w-1/2" />
        </div>
      ) : (
        <>
          {!urls.length ? (
            <p>No comments yet!</p>
          ) : (
            <>
              <div className="flex space-x-4 mb-4">
                <select
                  className="select select-bordered"
                  value={selectedUrl}
                  onChange={handleUrlChange}
                >
                  <option value="">Select URL</option>
                  {urls.map((url) => (
                    <option key={url} value={url}>
                      {url}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-bordered"
                  value={status}
                  onChange={handleStatusChange}
                >
                  <option value="">All Statuses</option>
                  {Object.values(CommentStatus).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search comments or usernames"
                  className="input input-bordered flex-grow"
                  value={search}
                  onChange={handleSearchChange}
                />
              </div>
              {selectedUrl ? (
                <CommentListBase disableItemActions={true} />
              ) : (
                <p>Please select a URL</p>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  )
}
