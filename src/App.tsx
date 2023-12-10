/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Controls, Table, Volume } from './components'
import { useGameContext } from './contexts'
import { useLayout } from './contexts/layoutContext'

const appCss = css({
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateRows: 'minmax(0, 2fr) minmax(0, 5fr)',
  '&.horizontal': {
    gridTemplateRows: '1fr',
    gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 2fr)',
    '> *:first-of-type': {
      order: 1,
    },
  },
})

function App() {
  const layout = useLayout()
  const { questions } = useGameContext()

  return (
    <div css={appCss} className={layout}>
      {questions.length && (
        <>
          <Controls />
          <Table />
          <Volume />
        </>
      )}
    </div>
  )
}

export default App
