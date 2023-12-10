/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import shuffle from 'lodash.shuffle'
import { ChangeEvent, useState } from 'react'

import { Question } from 'src/utils'

const newGameSettingsCss = css({
  color: 'var(--light-0)',
  fontSize: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '18px',
  '.form': {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    alignItems: 'center',
    rowGap: '16px',
    columnGap: '16px',
  },
  '.blitz-selector': {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4px',
    div: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'var(--dark-4)',
      color: 'var(--light-0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      '&.selected': {
        color: 'var(--dark-4)',
        backgroundColor: 'var(--light-0)',
      },
    },
  },
  '.error': {
    color: 'red',
  },
  '.buttons': {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
})

type NewGameSettingsProps = {
  onStart: (questions: Question[], team: string) => void
}

type Settings = {
  team: string
  numberOfQuestions: number
  blitz: number[]
}

const MIN_QUESTIONS = 11
const MAX_QUESTIONS = 17

export function NewGameSettings({ onStart }: NewGameSettingsProps) {
  const [settings, setSettings] = useState<Settings>({
    team: 'Собачий гавкіт',
    numberOfQuestions: 12,
    blitz: [],
  })
  const [error, setError] = useState('')

  const updateNumberOfQuestions = (event: ChangeEvent<HTMLInputElement>) => {
    let number = Number(event.target.value) || 0
    if (number < 0) number = 0
    if (number > MAX_QUESTIONS) number = MAX_QUESTIONS
    setError('')
    setSettings(set => ({
      ...set,
      numberOfQuestions: number,
      blitz: set.blitz.filter(blitz => blitz < number),
    }))
  }

  const updateTeam = (event: ChangeEvent<HTMLInputElement>) => {
    setError('')
    setSettings(set => ({
      ...set,
      team: event.target.value,
    }))
  }

  const toggleBlitz = (question: number) => {
    setSettings(set => ({
      ...set,
      blitz: set.blitz.includes(question) ? set.blitz.filter(blitz => blitz !== question) : [...set.blitz, question],
    }))
  }

  const start = () => {
    setError('')
    const { team, numberOfQuestions, blitz } = settings
    if (numberOfQuestions < MIN_QUESTIONS || numberOfQuestions > MAX_QUESTIONS) {
      setError(`Кількість питань має бути в межах від ${MIN_QUESTIONS} до ${MAX_QUESTIONS}`)
      return
    }
    if (!team) {
      setError('Назву команди не хочете ввести?')
    }
    const questions = [...new Array(numberOfQuestions)].map((_, index) => ({
      number: index + 1,
      blitz: blitz.includes(index),
    }))
    onStart(shuffle(questions), team)
  }

  return (
    <div css={newGameSettingsCss}>
      <div className="form">
        <label htmlFor="team">Назва команди</label>
        <input id="team" type="text" value={settings.team} onChange={updateTeam} />
        <label htmlFor="numberOfQuestions">Кількість питань</label>
        <input
          id="numberOfQuestions"
          type="number"
          value={settings.numberOfQuestions}
          onChange={updateNumberOfQuestions}
        />
        <label>Бліц</label>
        <div className="blitz-selector">
          {[...new Array(settings.numberOfQuestions)].map((_, index) => (
            <div
              key={index}
              onClick={() => toggleBlitz(index)}
              className={settings.blitz.includes(index) ? 'selected' : ''}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="buttons">
        <button onClick={start}>Почати</button>
      </div>
    </div>
  )
}
