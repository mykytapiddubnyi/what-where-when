/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useGameContext, useLayout } from 'src/contexts'

import { TextButton } from './TextButton'
import { usePlaySound } from 'src/hooks'

const gongCss = css({
  fontSize: '4.5vw',
  fontWeight: 'bold',
  color: 'var(--light-0)',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  paddingRight: '18px',
  '&.horizontal': {
    fontSize: '4vh',
    paddingRight: '0px',
  },
})

export function Gong() {
  const { startDiscussion, completeDiscussion, canStartDiscussion, discussionIsActive } = useGameContext()
  const layout = useLayout()
  const gongSound = usePlaySound('gong')

  return (
    <div css={gongCss} className={layout}>
      <TextButton onClick={() => gongSound.play()} disabled={!canStartDiscussion} text="ГОНГ" />
      {!discussionIsActive && <TextButton onClick={startDiscussion} disabled={!canStartDiscussion} text="ХВИЛИНА" />}
      {discussionIsActive && <TextButton onClick={completeDiscussion} text="ВІДПОВІДЬ" />}
    </div>
  )
}
