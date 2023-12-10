/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useGameContext } from 'src/contexts'
import { useElementSize } from 'src/hooks'

const DARK_COLOR = 'var(--dark-4)'
const LIGHT_COLOR = 'var(--light-0)'

const scoreCss = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  borderRadius: '32px',
  aspectRatio: '5 / 3',
  backgroundColor: 'var(--dark-1)',
  border: '10px solid var(--dark-2)',
  filter: 'drop-shadow(0px 0px 8px black)',
  overflow: 'hidden',
  fontWeight: 'bold',
  div: {
    flex: '0 0 50%',
    textAlign: 'center',
    '&:first-of-type': {
      color: DARK_COLOR,
      backgroundColor: LIGHT_COLOR,
    },
    '&:last-of-type': {
      color: LIGHT_COLOR,
      backgroundColor: DARK_COLOR,
    },
  },
})

export function Score() {
  const { scorePlayers, scoreInternet } = useGameContext()
  const { ref, height } = useElementSize()
  const fontSize = `${height || 0}px`

  return (
    <div css={scoreCss} ref={ref} style={{ fontSize: fontSize, lineHeight: fontSize }}>
      <div>{scorePlayers}</div>
      <div>{scoreInternet}</div>
    </div>
  )
}
