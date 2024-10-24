import {
  type BaseStoreProps,
  type CoreState,
  createBaseStore,
} from "@chatfall/client"
import { produce } from "immer"
import type { CommentStatus } from "../../db/schema"
import { type Settings, Sort } from "../../exports"
import type { Setting, SettingValue } from "../../settings/types"

export type ServerState = CoreState & {
  settings?: Settings
  hasAdmin: () => Promise<boolean>
  loadSettings: () => Promise<void>
  setSetting: (key: Setting, value: SettingValue<typeof key>) => Promise<void>

  settingUpdated?: boolean
  clearSettingUpdatedFlag: () => void

  selectedStatus: CommentStatus | undefined
  setSelectedStatus: (status: CommentStatus | undefined) => void

  search: string
  setSearch: (search: string) => void

  updateCommentStatus: (
    commentId: number,
    status: CommentStatus,
  ) => Promise<void>
  getCanonicalUrls: () => Promise<string[]>
}

export const createStore = (props: BaseStoreProps) => {
  return createBaseStore<ServerState>({
    props,
    createAdditionalState: (set, get, tryCatchApiCall, app) =>
      ({
        settings: undefined,
        settingUpdated: false,
        selectedStatus: undefined,
        clearSettingUpdatedFlag: () => {
          set(
            produce((state) => {
              state.settingUpdated = false
            }),
          )
        },
        hasAdmin: async () => {
          const data = await tryCatchApiCall<boolean>(set, () =>
            app.api.users.has_admin.get(),
          )

          return data
        },
        loadSettings: async () => {
          const data = await tryCatchApiCall<Settings>(set, () =>
            app.api.settings.index.get(),
          )

          set(
            produce((state) => {
              state.settings = data
            }),
          )
        },
        setSetting: async (key, value) => {
          // optimistic update
          const originalSettings = get().settings

          set(
            produce((state) => {
              state.settings[key] = value
            }),
          )

          try {
            const newSettings = await tryCatchApiCall<Settings>(set, () =>
              app.api.settings.index.put({
                key,
                value,
              }),
            )

            set(
              produce((state) => {
                state.settings = newSettings
                state.settingUpdated = true
              }),
            )
          } catch (error) {
            set(
              produce((state) => {
                state.settings = originalSettings
              }),
            )
            throw error
          }
        },
        setSelectedStatus: (status) => {
          set(
            produce((state) => {
              state.selectedStatus = status
            }),
          )
        },
        setSearch: (search) => {
          set(
            produce((state) => {
              state.search = search
            }),
          )
        },
        updateCommentStatus: async (commentId, status) => {
          await tryCatchApiCall<{ success: boolean }>(set, () =>
            app.api.comments.admin.comment_status.put({ commentId, status }),
          )

          // update comment in store
          set(
            produce((state) => {
              const comment = state.comments[commentId]
              if (comment) {
                comment.status = status
              }
            }),
          )
        },
        getCanonicalUrls: async () => {
          const data = await tryCatchApiCall<string[]>(set, () =>
            app.api.comments.admin.urls.get(),
          )
          return data
        },
      }) as Omit<ServerState, keyof CoreState>,
    fetchCommentsImplementation: async ({ app, get, url, sort, skip }) => {
      const hasFilter = get().selectedStatus || get().search
      return await app.api.comments.admin.comments.get({
        query: {
          url,
          depth: hasFilter ? "" : `0`,
          skip: `${skip}`,
          sort,
          ...(get().selectedStatus ? { status: get().selectedStatus } : {}),
          ...(get().search ? { search: get().search } : {}),
        },
      })
    },
    fetchRepliesImplementation: async ({
      app,
      url,
      parentDepth,
      parentPath,
      skip,
    }) => {
      return await app.api.comments.admin.comments.get({
        query: {
          url,
          depth: `${parentDepth + 1}`,
          pathPrefix: `${parentPath}.`,
          skip: `${skip}`,
          sort: Sort.oldestFirst,
        },
      })
    },
    onSocketMessage: () => {
      /* ignore */
    },
  })
}

export type ServerStore = ReturnType<typeof createStore>
