export type Question = {
  number: number
  blitz: boolean
  answers?: boolean[]
}

export function isUntouched(question: Question): boolean {
  return !question.answers
}

export function isPlaying(question: Question): boolean {
  return !isUntouched(question) && !isPlayed(question)
}

export function isPlayed(question: Question): boolean {
  return isWon(question) || isLost(question)
}

export function isWon(question: Question): boolean {
  const { answers, blitz } = question
  if (!answers?.length) return false
  return answers.every(answer => answer) && (!blitz || answers.length === 3)
}

export function isLost(question: Question): boolean {
  const { answers } = question
  if (!answers?.length) return false
  return answers.some(answer => !answer)
}

export function startPlayingQuestion(question: Question): Question {
  if (!isUntouched(question)) throw new Error('Question is already in play/played')
  return { ...question, answers: [] }
}

export function answerQuestion(question: Question, correct: boolean): Question {
  if (!isPlaying(question)) throw new Error('Question is not in play')
  return { ...question, answers: [...(question.answers || []), correct] }
}
