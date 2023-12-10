/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useLayout } from 'src/contexts'

import { Score } from './Score'
import { Gong } from './Gong'
import { RoundInfo } from './RoundInfo'

const controlsCss = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  alignItems: 'center',
  width: '100%',
  gap: '18px',
  '&.horizontal': {
    gridTemplateColumns: 'auto',
    gridTemplateRows: '1fr 1fr 1fr',
    width: 'auto',
    paddingRight: '42px',
  },
  '@media (max-width: 640px)': {
    gridTemplateColumns: '1fr 2fr 1fr',
  },
})

export function Controls() {
  const layout = useLayout()

  return (
    <div css={controlsCss} className={layout}>
      <RoundInfo />
      <Score />
      <Gong />
    </div>
  )
}
