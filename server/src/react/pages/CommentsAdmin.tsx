import { CommentListBase, useGlobalContext } from "@chatfall/client"
import {
  type ChangeEvent,
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import Select from "react-select"
import { CommentStatus } from "../../db/schema"
import { PageWrapper } from "../components/PageWrapper"
import type { ServerStore } from "../store/server"

const selectStyles = {
  container: (provided: any) => ({
    ...provided,
    minWidth: "400px",
  }),
}

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

  const handleUrlChange = useCallback((selectedOption: any) => {
    setSelectedUrl(selectedOption ? selectedOption.value : "")
  }, [])

  const urlOptions = useMemo(() => {
    return urls ? urls.map((url) => ({ value: url, label: url })) : []
  }, [urls])

  const headerContent = useMemo(() => {
    if (!selectedUrl) return null

    return (
      <>
        <select
          className="select select-bordered mr-2"
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
          placeholder="Search comments/usernames"
          className="input input-bordered w-64"
          value={search}
          onChange={handleSearchChange}
        />
      </>
    )
  }, [selectedUrl, status, search, handleStatusChange, handleSearchChange])

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
              <div className="mb-4">
                <Select
                  options={urlOptions}
                  value={urlOptions.find(
                    (option) => option.value === selectedUrl,
                  )}
                  onChange={handleUrlChange}
                  placeholder="Select URL"
                  isClearable
                  isSearchable
                  styles={selectStyles}
                />
              </div>
              {selectedUrl ? (
                <CommentListBase
                  title=""
                  url={selectedUrl}
                  disableItemActions={true}
                  disableAnimatedNumber={true}
                  showHeader={true}
                  headerContent={headerContent}
                />
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
