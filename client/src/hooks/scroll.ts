import { useCallback, useEffect, useRef } from "react"

export function useScrollIntoViewIfNeeded<T extends HTMLElement>() {
  const elementRef = useRef<T | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollIntoView = useCallback(() => {
    if (!elementRef.current) return

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry.isIntersecting) {
          elementRef.current?.scrollIntoView({ behavior: "smooth" })
        }
        observerRef.current?.disconnect()
      },
      { threshold: 0.1 },
    )

    observerRef.current.observe(elementRef.current)
  }, [])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { ref: elementRef, scrollIntoView }
}
