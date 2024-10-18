import type { ReactNode } from "react"

export const PageWrapper = (props: { children: ReactNode; title: string }) => {
  return (
    <div className="mx-auto w-full sm:max-w-[800px] flex flex-col items-center mt-8">
      {props.children}
    </div>
  )
}
