import { useRef, useState } from "react";

const SWIPE_THRESHOLD = 0.35;
const SWIPE_MAX = 0.5;

type Options = {
  canRight: boolean;
  canLeft: boolean;
  disabled?: boolean;
  onSwipeRight?: () => void | Promise<void>;
  onSwipeLeft?: () => void | Promise<void>;
};

export function useSwipeRow({
  canRight,
  canLeft,
  disabled,
  onSwipeRight,
  onSwipeLeft,
}: Options) {
  const [offset, setOffset] = useState(0);

  const startX = useRef(0);
  const rowWidth = useRef(0);
  const currentDelta = useRef(0);
  const pointerId = useRef<number | null>(null);

  const passed =
    offset !== 0 && Math.abs(offset) >= rowWidth.current * SWIPE_THRESHOLD;

  const reset = () => {
    pointerId.current = null;
    currentDelta.current = 0;
    setOffset(0);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if ((!canRight && !canLeft) || disabled) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;

    pointerId.current = e.pointerId;
    startX.current = e.clientX;
    rowWidth.current = e.currentTarget.getBoundingClientRect().width;
    currentDelta.current = 0;

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const delta = e.clientX - startX.current;
    const max = rowWidth.current * SWIPE_MAX;
    const min = canLeft ? -max : 0;
    const upper = canRight ? max : 0;

    currentDelta.current = Math.max(min, Math.min(delta, upper));
    setOffset(currentDelta.current);
  };

  const onPointerUp = async (e: React.PointerEvent<HTMLElement>) => {
    if (pointerId.current !== e.pointerId) return;

    const delta = currentDelta.current;
    const shouldAccept = Math.abs(delta) >= rowWidth.current * SWIPE_THRESHOLD;

    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    reset();

    if (!shouldAccept || disabled) return;

    if (delta > 0 && canRight) await onSwipeRight?.();
    else if (delta < 0 && canLeft) await onSwipeLeft?.();
  };

  return {
    offset,
    passed,
    isRight: offset > 0,
    swiping: offset !== 0,
    canSwipe: canRight || canLeft,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: reset,
    },
  };
}
