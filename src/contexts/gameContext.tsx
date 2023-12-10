import { PropsWithChildren, createContext, useContext, useState } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal } from 'react-responsive-modal'

import { AcceptAnswer, NewGameSettings } from 'src/components'
import {
  Question,
  answerQuestion,
  isLost,
  isPlayed,
  isPlaying,
  isUntouched,
  isWon,
  startPlayingQuestion,
} from 'src/utils'
import { usePlaySound } from 'src/hooks'

type GameContextValue = {
  questions: Question[]
  currentRound: number
  currentQuestion: number | undefined
  currentBlitzSubQuestion: number | undefined
  scorePlayers: number
  scoreInternet: number
  discussionIsActive: boolean
  canStartDiscussion: boolean
  startRound: (sector: number) => void
  startDiscussion: () => void
  completeDiscussion: () => void
  acceptAnswer: (correct: boolean) => void
}

const GameContext = createContext<GameContextValue>({
  questions: [],
  currentRound: 1,
  currentQuestion: undefined,
  currentBlitzSubQuestion: undefined,
  scorePlayers: 0,
  scoreInternet: 0,
  discussionIsActive: false,
  canStartDiscussion: false,
  startRound: () => {},
  startDiscussion: () => {},
  completeDiscussion: () => {},
  acceptAnswer: () => false,
})

function GameContextProvider({ children }: PropsWithChildren) {
  const [team, setTeam] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [startGameModalOpened, setStartGameModalOpened] = useState(true)
  const [acceptAnswerModalOpened, setAcceptAnswerModalOpened] = useState(false)
  const [gameOverModalOpened, setGameOverModalOpened] = useState(false)
  const [gameOverMessage, setGameOverMessage] = useState('')
  const [discussionIsActive, setDiscussionIsActive] = useState(false)
  const startSound = usePlaySound('start')
  const winSound = usePlaySound('win', 0.5)
  const lossSound = usePlaySound('loss', 0.5)
  const currentQuestionIndex = questions.findIndex(isPlaying)
  const currentQuestion = questions[currentQuestionIndex]

  const scorePlayers = questions.filter(isWon).length
  const scoreInternet = questions.filter(isLost).length
  const scoreToWin = Math.ceil(questions.length / 2)

  const canStartDiscussion = currentQuestion && !discussionIsActive

  const onGameStart = (newQuestions: Question[], teamName: string) => {
    startSound.play()
    setTeam(teamName)
    document.title = `${teamName} - Що? Де? Коли?`
    setQuestions(newQuestions)
    setStartGameModalOpened(false)
  }

  const updateQuestion = (index: number, func: (question: Question) => Question) => {
    const updatedQuestion = func(questions[index])
    setQuestions([...questions.map((q, i) => (index === i ? updatedQuestion : q))])
    return updatedQuestion
  }

  const startRound = (sector: number) => {
    let questionIndex = questions.findIndex((q, index) => index >= sector && isUntouched(q))
    if (questionIndex === -1) questionIndex = questions.findIndex(q => isUntouched(q))
    updateQuestion(questionIndex, startPlayingQuestion)
  }

  const startDiscussion = () => {
    setDiscussionIsActive(true)
    setAcceptAnswerModalOpened(false)
  }

  const completeDiscussion = () => {
    setDiscussionIsActive(false)
    setAcceptAnswerModalOpened(true)
  }

  const acceptAnswer = (correct: boolean) => {
    const question = updateQuestion(currentQuestionIndex, question => answerQuestion(question, correct))
    setAcceptAnswerModalOpened(false)
    if (isWon(question)) {
      winSound.play()
      if (scorePlayers === scoreToWin - 1) {
        setGameOverMessage(`Перемога команди "${team}"!`)
        setGameOverModalOpened(true)
      }
    } else if (isLost(question)) {
      lossSound.play()
      if (scoreInternet === scoreToWin - 1) {
        setGameOverMessage(`Поразка команди "${team}"`)
        setGameOverModalOpened(true)
      }
    }
  }

  return (
    <GameContext.Provider
      value={{
        questions,
        currentRound: questions.filter(isPlayed).length + 1,
        currentQuestion: currentQuestion?.number,
        currentBlitzSubQuestion: currentQuestion?.blitz ? (currentQuestion?.answers?.length || 0) + 1 : undefined,
        scorePlayers,
        scoreInternet,
        discussionIsActive,
        canStartDiscussion,
        startRound,
        startDiscussion,
        completeDiscussion,
        acceptAnswer,
      }}
    >
      {children}
      {startGameModalOpened && (
        <Modal
          open={true}
          onClose={() => setStartGameModalOpened(false)}
          center
          showCloseIcon={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
        >
          <NewGameSettings onStart={onGameStart} />
        </Modal>
      )}
      <Modal
        open={acceptAnswerModalOpened}
        onClose={() => setAcceptAnswerModalOpened(false)}
        center
        showCloseIcon={false}
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <AcceptAnswer />
      </Modal>
      {gameOverModalOpened && (
        <Modal
          open={true}
          onClose={() => setGameOverModalOpened(false)}
          center
          showCloseIcon={false}
          closeOnOverlayClick={false}
          closeOnEsc={false}
        >
          <div style={{ fontSize: '2rem', margin: '2rem' }}>{gameOverMessage}</div>
        </Modal>
      )}
    </GameContext.Provider>
  )
}

function useGameContext() {
  return useContext(GameContext)
}

// eslint-disable-next-line react-refresh/only-export-components
export { GameContextProvider, useGameContext }
