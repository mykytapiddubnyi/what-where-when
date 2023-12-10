/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useRef, useState } from 'react'
import { css } from '@emotion/react'

import { animate, easeInOutQuint, getCoordinates, getRandomInt, isUntouched } from 'src/utils'
import { useGameContext } from 'src/contexts'
import { usePlaySound } from 'src/hooks'

const tableCss = css({
  position: 'relative',
  alignSelf: 'center',
  height: '100%',
  width: '100%',
  '> *, #spinner': {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  '.table': {
    filter: 'drop-shadow(0px 0px 32px black)',
    '.question-envelope': {
      transitionProperty: 'opacity',
      transitionDuration: '500ms',
      '&.played': {
        opacity: 0,
      },
    },
  },
  '.spinner-container': {
    overflow: 'hidden',
    filter: 'drop-shadow(15px 5px 2px rgb(0 0 0 / 0.7))',
    '#spinner': {
      transformOrigin: '50% 50%',
    },
  },
})

const TABLE_RADIUS = 45
const SUB_RADIUS = 29
const CENTER_RADIUS = 8
const PROGRESS_RADIUS = TABLE_RADIUS + 1.5

const MINUTE_LENGTH = 90 * 1000
const BLITZ_LENGTH = 30 * 1000
const PRE_FINISH = 10 * 1000

export function Table() {
  const { questions, currentQuestion, currentBlitzSubQuestion, startRound, discussionIsActive, completeDiscussion } =
    useGameContext()
  const [spinIsActive, setSpinIsActive] = useState(false)
  const spinSound = usePlaySound('spin')
  const discussionStart = usePlaySound('discussion-start')
  const discussionFinishing = usePlaySound('discussion-finishing')
  const discussionEnd = usePlaySound('discussion-end')
  const numberOfQuestions = questions.length
  const angle = 360 / numberOfQuestions

  const arrowPath = useMemo(() => {
    const anglePadding = 7 - (numberOfQuestions - 11) / 2
    const arrowWidth = 4
    const arrowHeadWidth = 8
    const arrowHeadAngle = 7
    const sectionWidth = TABLE_RADIUS - SUB_RADIUS
    const arrowPadding = (sectionWidth - arrowWidth) / 2
    const arrowHeadPadding = (sectionWidth - arrowHeadWidth) / 2

    const points = [
      getCoordinates(anglePadding, TABLE_RADIUS - arrowPadding),
      getCoordinates(angle - anglePadding - arrowHeadAngle, TABLE_RADIUS - arrowPadding),
      getCoordinates(angle - anglePadding - arrowHeadAngle, TABLE_RADIUS - arrowHeadPadding),
      getCoordinates(angle - anglePadding, TABLE_RADIUS - sectionWidth / 2),
      getCoordinates(angle - anglePadding - arrowHeadAngle, SUB_RADIUS + arrowHeadPadding),
      getCoordinates(angle - anglePadding - arrowHeadAngle, SUB_RADIUS + arrowPadding),
      getCoordinates(anglePadding, SUB_RADIUS + arrowPadding),
    ]
    return [
      `M ${points[0].x} ${points[0].y}`,
      `A ${TABLE_RADIUS - arrowPadding} ${TABLE_RADIUS - arrowPadding} 0 0 1 ${points[1].x} ${points[1].y}`,
      `L ${points[2].x} ${points[2].y}`,
      `L ${points[3].x} ${points[3].y}`,
      `L ${points[4].x} ${points[4].y}`,
      `L ${points[5].x} ${points[5].y}`,
      `A ${SUB_RADIUS + arrowPadding} ${SUB_RADIUS + arrowPadding} 0 0 0 ${points[6].x} ${points[6].y}`,
      'Z',
    ]
  }, [angle, numberOfQuestions])

  const envelopeRect = useMemo(() => {
    const anglePadding = 6 - (numberOfQuestions - 11) / 2
    const leftUp = getCoordinates(0 - angle / 2 + anglePadding, TABLE_RADIUS - 2.5)
    return {
      x: leftUp.x,
      y: leftUp.y,
      width: Math.abs(leftUp.x * 2),
      height: 10,
    }
  }, [angle, numberOfQuestions])

  const envelopText = useMemo(() => {
    const textHeight = envelopeRect.height * 0.75
    return {
      x: envelopeRect.x,
      y: envelopeRect.y + textHeight,
      height: textHeight,
      offset: (number: number) => {
        const numberWidth = textHeight * (number < 10 ? 0.6 : 1.2)
        return envelopeRect.width / 2 - numberWidth / 2
      },
    }
  }, [envelopeRect])

  const spinnerRef = useRef<SVGSVGElement>(null)
  const progressRef = useRef<SVGCircleElement>(null)
  const progressLength = useMemo(() => Math.PI * 2 * PROGRESS_RADIUS, [])
  const spinnerAngleRef = useRef(0)

  const onSpinClick = () => {
    if (currentQuestion || spinIsActive) return
    setSpinIsActive(true)
    spinSound.play()
    setTimeout(() => spinSound.fade(), 15 * 1000)
    const targetDeg = getRandomInt(360) + 360 * 20
    animate({
      duration: 17 * 1000,
      callback: value => {
        if (!spinnerRef.current || spinnerAngleRef.current === undefined) return
        spinnerAngleRef.current = (value * targetDeg) % 360
        spinnerRef.current.style.transform = `rotate(${spinnerAngleRef.current}deg)`
      },
      onCompleted: () => {
        const adjustedAngle = (spinnerAngleRef.current + angle / 2) % 360
        const sector = Math.floor(adjustedAngle / angle)
        setTimeout(() => startRound(sector), 500)
        setSpinIsActive(false)
      },
      easeFunction: easeInOutQuint,
    })
  }

  const progressAnimationRef = useRef(() => {})
  const progressSignalRef = useRef(0)

  useEffect(() => {
    if (!progressRef.current) return
    if (discussionIsActive) {
      const minuteLength = currentBlitzSubQuestion ? BLITZ_LENGTH : MINUTE_LENGTH
      discussionStart.play()
      progressSignalRef.current = setTimeout(() => discussionFinishing.play(), minuteLength - PRE_FINISH)
      progressAnimationRef.current = animate({
        duration: minuteLength,
        callback: value => {
          if (!progressRef.current) return
          const length = value * progressLength
          progressRef.current.style.strokeDasharray = `${length} 999`
        },
        onCompleted: () => {
          completeDiscussion()
          discussionEnd.play()
        },
      })
    } else {
      progressAnimationRef.current()
      if (progressSignalRef.current) clearTimeout(progressSignalRef.current)
      progressRef.current.style.strokeDasharray = '0 999'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discussionIsActive])

  return (
    <div css={tableCss}>
      <svg className="table" viewBox="-50 -50 100 100">
        <circle cx="0" cy="0" r={TABLE_RADIUS} strokeWidth="0" fill="var(--dark-1)" />
        <circle cx="0" cy="0" r={SUB_RADIUS} strokeWidth="0" fill="var(--dark-2)" />
        {questions.map((_, index) => (
          <line
            key={index}
            x1="0"
            y1="0"
            x2="0"
            y2={`-${TABLE_RADIUS}`}
            stroke="var(--dark-3)"
            strokeWidth="0.5"
            transform={`rotate(${index * angle - angle / 2} 0 0)`}
          />
        ))}
        <circle cx="0" cy="0" r={TABLE_RADIUS} strokeWidth="0.5" stroke="#96660c" fill="none" />
        <circle cx="0" cy="0" r={SUB_RADIUS} strokeWidth="0.5" stroke="#96660c" fill="none" />
        {questions.map((_, index) => (
          <path
            key={index}
            d={arrowPath.join(' ')}
            strokeWidth="0"
            fill="var(--dark-2)"
            transform={`rotate(${index * angle - angle / 2} 0 0)`}
          />
        ))}
        {questions.map((question, index) => (
          <g
            className={`question-envelope${!isUntouched(question) ? ' played' : ''}`}
            key={index}
            transform={`rotate(${index * angle} 0 0)`}
          >
            <rect {...envelopeRect} x={envelopeRect.x + 0.3} y={envelopeRect.y + 0.3} rx="1" fill="black" />
            <rect {...envelopeRect} rx="1" fill="var(--light-0)" />
            {question.blitz && (
              <>
                <rect
                  x={envelopeRect.x + envelopeRect.width - 3}
                  y={envelopeRect.y + envelopeRect.height - 3}
                  width="2.5"
                  height="2.5"
                  rx="0.5"
                  fill="green"
                />
                <text
                  x={envelopeRect.x + envelopeRect.width - 2.3}
                  y={envelopeRect.y + envelopeRect.height - 1}
                  fontSize="2"
                  fontWeight="bold"
                  fill="var(--light-0)"
                >
                  Б
                </text>
              </>
            )}
            <text
              x={envelopText.x}
              y={envelopText.y}
              transform={`translate(${envelopText.offset(question.number)}, 0)`}
              fontWeight="bold"
              fontSize={envelopText.height}
            >
              {question.number}
            </text>
          </g>
        ))}
        <circle
          cx="0"
          cy="0"
          r={PROGRESS_RADIUS}
          strokeWidth="2"
          stroke="var(--light-0)"
          fill="none"
          transform="rotate(-90, 0, 0)"
          ref={progressRef}
          strokeDasharray="0 999"
        />
      </svg>
      <div className="spinner-container">
        <svg id="spinner" viewBox="-50 -50 100 100" ref={spinnerRef}>
          <g onClick={onSpinClick} style={{ cursor: 'pointer' }}>
            <path
              d={`M -1.5 0 L -0.5 -${TABLE_RADIUS - 7} L 0 -${TABLE_RADIUS - 5} L 0.5 -${TABLE_RADIUS - 7} L 1.5 0 Z`}
              fill="#b81d1d"
            />
            <circle cx="0" cy="0" r={CENTER_RADIUS} strokeWidth="0.5" stroke="#96660c" fill="#dece85" />
            {[...new Array(4)].map((_, index) => (
              <line
                key={index}
                x1="0"
                y1="0"
                x2="0"
                y2={`-${CENTER_RADIUS - 0.25}`}
                stroke="#e6dcb3"
                strokeWidth="0.25"
                transform={`rotate(${index * 90 - 45} 0 0)`}
              />
            ))}
            <circle cx="0" cy="0" r={3} strokeWidth="0.5" stroke="#96660c" fill="#b81d1d" />
          </g>
        </svg>
      </div>
    </div>
  )
}
