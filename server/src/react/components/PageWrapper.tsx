import type { ReactNode } from "react"

export const PageWrapper = (props: { children: ReactNode; title: string }) => {
  return (
    <div className="mx-auto w-full md:max-w-[800px] flex flex-col items-center mt-8">
      <h1 className="text-3xl mb-6">{props.title}</h1>
      {props.children}
    </div>
  )
}
