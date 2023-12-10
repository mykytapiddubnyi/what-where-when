/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useState } from 'react'

const volumeCss = css({
  position: 'absolute',
  bottom: '12px',
  left: '12px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'row',
  gap: '18px',
  '&:hover': {
    svg: {
      fill: 'var(--light-0)',
    },
  },
  svg: {
    width: '50px',
    height: '50px',
    fill: 'var(--dark-2)',
    cursor: 'pointer',
    transition: '300ms',
    transitionProperty: 'fill',
  },
  input: {
    opacity: 1,
    width: '100px',
    accentColor: 'var(--light-0)',
    transition: 'visibility 0s, opacity 0.3s linear',
    '&.hide': {
      visibility: 'hidden',
      opacity: 0,
    },
  },
})

export function Volume() {
  const [showInput, setShowInput] = useState(false)
  const [volume, setVolume] = useState<number>(0.5)

  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  return (
    <div css={volumeCss} onMouseEnter={() => setShowInput(true)} onMouseLeave={() => setShowInput(false)}>
      <svg viewBox="0 0 300 300">
        <path
          d="M149.996,0C67.157,0,0.001,67.161,0.001,149.997S67.157,300,149.996,300s150.003-67.163,150.003-150.003
			S232.835,0,149.996,0z M149.303,204.044h-0.002v-0.001c0,3.418-1.95,6.536-5.021,8.03c-1.24,0.602-2.578,0.903-3.909,0.903
			c-1.961,0-3.903-0.648-5.506-1.901l-29.289-22.945c-1.354,0.335-2.767,0.537-4.235,0.537h-29.35
			c-9.627,0-17.431-7.807-17.431-17.429v-50.837c0-9.625,7.804-17.431,17.431-17.431h29.352c1.707,0,3.348,0.257,4.912,0.711
			l28.612-22.424c2.684-2.106,6.344-2.492,9.415-0.999c3.071,1.494,5.021,4.609,5.021,8.027V204.044z M178.616,167.361l-9.788-9.788
			c2.256-3.084,3.608-6.87,3.608-10.979c0-4.536-1.631-8.699-4.331-11.936l9.713-9.713c5.177,5.745,8.362,13.323,8.362,21.649
			C186.177,154.492,183.331,161.733,178.616,167.361z M191.307,180.054c7.944-8.901,12.781-20.624,12.781-33.46
			c0-13.264-5.166-25.334-13.585-34.334l9.716-9.716c10.903,11.495,17.613,26.997,17.613,44.049c0,16.625-6.37,31.792-16.793,43.188
			L191.307,180.054z M224.385,212.84l-9.713-9.716c13.793-14.846,22.25-34.715,22.25-56.532c0-22.243-8.797-42.454-23.073-57.393
			l9.716-9.713c16.762,17.429,27.098,41.075,27.098,67.106C250.664,172.201,240.663,195.502,224.385,212.84z"
        />
      </svg>
      <input
        className={showInput ? 'show' : 'hide'}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={event => setVolume(event.target.valueAsNumber)}
      />
    </div>
  )
}
