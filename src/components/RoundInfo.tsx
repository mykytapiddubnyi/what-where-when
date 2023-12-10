/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

import { useGameContext, useLayout } from 'src/contexts'

const roundInfoCss = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontWeight: 'bold',
  color: 'var(--light-0)',
  paddingLeft: '12px',
  '.question': {
    fontSize: '12vw',
  },
  '.question-label': {
    fontSize: '3vw',
  },
  '.round': {
    fontSize: '2vw',
    marginTop: '8px',
  },
  '&.horizontal': {
    paddingLeft: '0px',
    paddingTop: '12px',
    '.question': {
      fontSize: '7vw',
    },
    '.question-label': {
      fontSize: '3vw',
    },
    '.round': {
      fontSize: '1vw',
    },
  },
})

export function RoundInfo() {
  const { currentRound, currentQuestion, currentBlitzSubQuestion } = useGameContext()
  const layout = useLayout()
  const questions = [currentQuestion, currentBlitzSubQuestion].filter(question => !!question)

  return (
    <div css={roundInfoCss} className={layout}>
      <div className="question">{questions.join('-') || '-'}</div>
      <div className="question-label">питання</div>
      <div className="round">Раунд {currentRound}</div>
    </div>
  )
}
