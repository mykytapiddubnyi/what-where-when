/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useGameContext } from 'src/contexts'

const acceptAnswerCss = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

export function AcceptAnswer() {
  const { acceptAnswer, startDiscussion } = useGameContext()

  return (
    <div css={acceptAnswerCss}>
      <button onClick={() => acceptAnswer(true)}>Вірно</button>
      <button onClick={() => acceptAnswer(false)}>Не вірно</button>
      <button onClick={() => startDiscussion()}>Додаткова хвилина</button>
    </div>
  )
}
