import { Howl } from 'howler'
import { useCallback, useMemo } from 'react'

export function usePlaySound(file: string, volume: number = 1) {
  const sound = useMemo(
    () =>
      new Howl({
        src: [`/sounds/${file}.mp3`],
        preload: true,
        volume,
      }),
    [file, volume]
  )

  const play = useCallback(() => {
    Howler.stop()
    sound.volume(volume)
    sound.play()
  }, [sound, volume])

  const fade = useCallback(
    (duration: number = 2000) => {
      if (!sound.playing()) return
      sound.fade(1, 0, duration)
    },
    [sound]
  )

  return { play, fade }
}
