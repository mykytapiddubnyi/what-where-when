import { useCallback, useEffect, useRef, useState } from 'react'

export function useElementSize() {
  const ref = useRef(null)
  const [width, setWidth] = useState<number>()
  const [height, setHeight] = useState<number>()

  const onResize: ResizeObserverCallback = useCallback(entries => {
    const contentRect = entries[0].contentRect
    setWidth(contentRect.width)
    setHeight(contentRect.height)
  }, [])

  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(onResize)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [onResize, ref])

  return { ref, width, height }
}
