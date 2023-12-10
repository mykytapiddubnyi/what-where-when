export function easeInOutQuint(x: number): number {
  return Math.sqrt(1 - Math.pow(x - 1, 2))
}

export function animate({
  duration,
  easeFunction,
  callback,
  onCompleted,
}: {
  duration: number
  easeFunction?: (x: number) => number
  callback: (x: number) => void
  onCompleted: () => void
}) {
  let start: number | null = null
  let stop = false

  function stopAnimation() {
    stop = true
  }

  function step(timestamp: number) {
    if (!start) start = timestamp
    if (stop) return

    const progress = (timestamp - start) / duration
    const easedProgress = easeFunction ? easeFunction(progress > 1 ? 1 : progress) : progress

    callback(easedProgress)

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      onCompleted()
    }
  }

  requestAnimationFrame(step)

  return stopAnimation
}

export function getCoordinates(angle: number, distance: number): { x: number; y: number } {
  return {
    x: distance * Math.cos((angle - 90) * (Math.PI / 180)),
    y: distance * Math.sin((angle - 90) * (Math.PI / 180)),
  }
}
