import { useRef } from "react";

export function useSwipeNavigation(chooseImage) {
    const startX = useRef(null);
    const isDown = useRef(false);
    const isMultiTouch = useRef(false);
    const activeTouches = useRef(new Set());

    const handleStart = (x) => {
        startX.current = x;
        isDown.current = true;
    };

    const handleEnd = (x) => {
        if (startX.current === null) return;

        const diffX = x - startX.current;
        startX.current = null;
        isDown.current = false;

        if (isMultiTouch.current) {
            isMultiTouch.current = false;
            return;
        }

        if (Math.abs(diffX) > 50) {
            chooseImage(diffX < 0 ? "next" : "prev");
        }
    };

    const onTouchStart = (e) => {
        for (const t of e.touches) activeTouches.current.add(t.identifier);

        if (e.touches.length > 1) {
            isMultiTouch.current = true;
            return;
        }
        handleStart(e.touches[0].clientX);
    };

    const onTouchMove = (e) => {
        if (e.touches.length > 1) {
            isMultiTouch.current = true;
        }
    };

    const onTouchEnd = (e) => {
        for (const t of e.changedTouches) activeTouches.current.delete(t.identifier);

        if (isMultiTouch.current) {
            if (activeTouches.current.size === 0) {
                isMultiTouch.current = false;
                startX.current = null;
                isDown.current = false;
            }
            return;
        }

        if (e.changedTouches.length === 1) {
            handleEnd(e.changedTouches[0].clientX);
        }
    };

    const onTouchCancel = () => {
        activeTouches.current.clear();
        isMultiTouch.current = false;
        startX.current = null;
        isDown.current = false;
    };

    const onMouseDown = (e) => handleStart(e.clientX);
    const onMouseUp = (e) => {
        if (!isDown.current) return;
        handleEnd(e.clientX);
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
        onMouseDown,
        onMouseUp,
    };
}
