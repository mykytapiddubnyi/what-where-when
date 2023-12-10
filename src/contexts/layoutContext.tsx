import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react'

type Layout = 'vertical' | 'horizontal'

const LayoutContext = createContext<Layout>('vertical')

function LayoutContextProvider({ children }: PropsWithChildren) {
  const [layout, setLayout] = useState<Layout>('vertical')

  useEffect(() => {
    const onResize = () => {
      const { innerWidth, innerHeight } = window
      if (!innerWidth || !innerHeight) return
      setLayout(innerWidth > innerHeight ? 'horizontal' : 'vertical')
    }
    window.addEventListener('resize', onResize)
    onResize()
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return <LayoutContext.Provider value={layout}>{children}</LayoutContext.Provider>
}

function useLayout() {
  return useContext(LayoutContext)
}

// eslint-disable-next-line react-refresh/only-export-components
export { LayoutContextProvider, useLayout }
