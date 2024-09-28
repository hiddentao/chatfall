import {
  CommentListBase,
  type CommentListBaseProps,
  DefaultCommentFilters,
  useGlobalContext,
} from "@chatfall/client"
import { type FC, useCallback, useEffect, useMemo, useState } from "react"
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

  const handleUrlChange = useCallback((selectedOption: any) => {
    setSelectedUrl(selectedOption ? selectedOption.value : "")
  }, [])

  const urlOptions = useMemo(() => {
    return urls ? urls.map((url) => ({ value: url, label: url })) : []
  }, [urls])

  const renderHeaderContent = useMemo(() => {
    const fn: CommentListBaseProps["renderHeaderContent"] = ({
      setIsLoading,
      setError,
    }) => {
      if (!selectedUrl) return null

      return (
        <CommentFilters
          setIsLoading={setIsLoading}
          setError={setError}
          selectedUrl={selectedUrl}
        />
      )
    }

    return fn
  }, [selectedUrl])

  return (
    <PageWrapper title="Comments Admin">
      {!urls ? (
        <div className={"flex flex-row justify-center items-center w-full"}>
          <div className="skeleton h-32 w-1/2" />
        </div>
      ) : (
        <>
          {!urls.length ? (
            <p className="italic">No comments found!</p>
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
                  className="w-full"
                  url={selectedUrl}
                  disableItemActions={true}
                  disableAnimatedNumber={true}
                  showHeader={true}
                  renderHeaderContent={renderHeaderContent}
                  headerClassName="justify-center"
                  floatingHeader={true}
                />
              ) : (
                <p className="italic">Please select a URL</p>
              )}
            </>
          )}
        </>
      )}
    </PageWrapper>
  )
}

interface CommentFiltersProps {
  selectedUrl: string
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string) => void
}

const CommentFilters: FC<CommentFiltersProps> = ({
  selectedUrl,
  setIsLoading,
  setError,
}) => {
  const { store } = useGlobalContext<ServerStore>()
  const {
    fetchComments,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
  } = store.useStore()

  const [searchInput, setSearchInput] = useState<string>("")

  const filterByStatus = useCallback(
    async (newStatus: CommentStatus | "") => {
      setIsLoading(true)
      setError("")

      try {
        await setSelectedStatus(newStatus || undefined)
        await fetchComments({ url: selectedUrl, skipOverride: 0 })
      } catch (error: any) {
        setError(error.toString())
      } finally {
        setIsLoading(false)
      }
    },
    [fetchComments, selectedUrl, setSelectedStatus, setIsLoading, setError],
  )

  const filterBySearch = useCallback(
    async (newSearch: string) => {
      setIsLoading(true)
      setError("")

      try {
        await setSearch(newSearch)
        await fetchComments({ url: selectedUrl, skipOverride: 0 })
      } catch (error: any) {
        setError(error.toString())
      } finally {
        setIsLoading(false)
      }
    },
    [fetchComments, selectedUrl, setSearch, setIsLoading, setError],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        filterBySearch(searchInput)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchInput, search, filterBySearch])

  return (
    <div className="flex flex-row text-sm">
      <div>
        <DefaultCommentFilters
          setIsLoading={setIsLoading}
          setError={setError}
        />
      </div>
      <div className="ml-8">
        <span className="mr-2">Status:</span>
        <select
          className="select select-sm rounded-md text-base-content"
          value={selectedStatus}
          onChange={(e) => filterByStatus(e.target.value as CommentStatus)}
        >
          <option value="">All statuses</option>
          {Object.values(CommentStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="ml-8">
        <span className="mr-2">Search:</span>
        <input
          type="text"
          placeholder="Search comments/usernames"
          className="input input-sm input-bordered text-base-content md:w-72 w-40"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  )
}
