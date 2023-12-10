/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'

const textButtonCss = css({
  cursor: 'pointer',
  '&.disabled': {
    cursor: 'not-allowed',
    color: 'var(--dark-4)',
  },
})

type TextButtonProps = {
  text: string
  onClick: () => void
  disabled?: boolean
}

export function TextButton({ onClick, disabled, text }: TextButtonProps) {
  return (
    <div css={textButtonCss} className={disabled ? 'disabled' : ''} onClick={!disabled ? onClick : () => {}}>
      {text}
    </div>
  )
}
