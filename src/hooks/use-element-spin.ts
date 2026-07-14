import { useCallback, useEffect, useRef } from 'react';

const FULL_ROTATION = 360;
const INITIAL_ANGULAR_VELOCITY = 60;
const MAX_ANGULAR_VELOCITY = 900;
const ACCELERATION_DURATION_MS = 1800;
const HOVER_INTENT_DELAY_MS = 250;
const MIN_SETTLE_DURATION_MS = 600;
const SETTLE_DURATION_DISTANCE_FACTOR = 1.5;
const MAX_FRAME_DELTA_MS = 50;
const BEZIER_X1 = 0.34;
const BEZIER_Y1 = 0;
const BEZIER_X2 = 0.84;
const BEZIER_Y2 = 1;
const BEZIER_SEARCH_ITERATIONS = 12;

const sampleCubicBezier = (progress: number, controlPoint1: number, controlPoint2: number) => {
  const inverseProgress = 1 - progress;
  return (
    3 * inverseProgress * inverseProgress * progress * controlPoint1 +
    3 * inverseProgress * progress * progress * controlPoint2 +
    progress * progress * progress
  );
};

const resolveAccelerationProgress = (progress: number) => {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  let lowerBound = 0;
  let upperBound = 1;

  for (let index = 0; index < BEZIER_SEARCH_ITERATIONS; index += 1) {
    const parameter = (lowerBound + upperBound) / 2;
    const timeProgress = sampleCubicBezier(parameter, BEZIER_X1, BEZIER_X2);

    if (timeProgress < progress) {
      lowerBound = parameter;
    } else {
      upperBound = parameter;
    }
  }

  return sampleCubicBezier((lowerBound + upperBound) / 2, BEZIER_Y1, BEZIER_Y2);
};

type SettleMotion = {
  startAngle: number;
  startVelocity: number;
  targetAngle: number;
  startTime: number | null;
  durationMs: number;
};

const useElementSpin = <T extends HTMLElement = HTMLElement>() => {
  const elementRef = useRef<T>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverIntentTimeoutRef = useRef<number | null>(null);
  const animateFrameRef = useRef<FrameRequestCallback>(() => undefined);
  const angleRef = useRef(0);
  const angularVelocityRef = useRef(0);
  const accelerationStartTimeRef = useRef<number | null>(null);
  const accelerationStartVelocityRef = useRef(INITIAL_ANGULAR_VELOCITY);
  const lastFrameTimeRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  const settleMotionRef = useRef<SettleMotion | null>(null);
  const reduceMotionRef = useRef(false);

  const cancelAnimationFrame = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const clearHoverIntentTimeout = useCallback(() => {
    if (hoverIntentTimeoutRef.current !== null) {
      window.clearTimeout(hoverIntentTimeoutRef.current);
      hoverIntentTimeoutRef.current = null;
    }
  }, []);

  const resetMotion = useCallback(() => {
    cancelAnimationFrame();
    clearHoverIntentTimeout();
    angleRef.current = 0;
    angularVelocityRef.current = 0;
    accelerationStartTimeRef.current = null;
    accelerationStartVelocityRef.current = INITIAL_ANGULAR_VELOCITY;
    lastFrameTimeRef.current = null;
    isHoveredRef.current = false;
    settleMotionRef.current = null;

    const element = elementRef.current;
    if (element) {
      element.style.transform = 'rotate(0deg)';
      element.style.willChange = '';
    }
  }, [cancelAnimationFrame, clearHoverIntentTimeout]);

  const requestNextFrame = useCallback(() => {
    if (animationFrameRef.current === null) {
      animationFrameRef.current = window.requestAnimationFrame((timestamp) => animateFrameRef.current(timestamp));
    }
  }, []);

  const beginAcceleration = useCallback(
    (startVelocity: number) => {
      clearHoverIntentTimeout();

      const angularVelocity = Math.min(Math.max(startVelocity, INITIAL_ANGULAR_VELOCITY), MAX_ANGULAR_VELOCITY);
      angularVelocityRef.current = angularVelocity;
      accelerationStartVelocityRef.current = angularVelocity;
      accelerationStartTimeRef.current = null;
      lastFrameTimeRef.current = null;

      const element = elementRef.current;
      if (element) {
        element.style.willChange = 'transform';
      }

      requestNextFrame();
    },
    [clearHoverIntentTimeout, requestNextFrame],
  );

  useEffect(() => {
    animateFrameRef.current = (timestamp) => {
      animationFrameRef.current = null;

      const element = elementRef.current;
      if (!element || reduceMotionRef.current) {
        resetMotion();
        return;
      }

      if (isHoveredRef.current) {
        const previousTimestamp = lastFrameTimeRef.current ?? timestamp;
        const deltaTimeMs = Math.min(Math.max(timestamp - previousTimestamp, 0), MAX_FRAME_DELTA_MS);
        const accelerationStartTime = accelerationStartTimeRef.current ?? timestamp;
        accelerationStartTimeRef.current = accelerationStartTime;

        const accelerationProgress = Math.min(
          Math.max((timestamp - accelerationStartTime) / ACCELERATION_DURATION_MS, 0),
          1,
        );
        const easedProgress = resolveAccelerationProgress(accelerationProgress);
        const angularVelocity =
          accelerationStartVelocityRef.current +
          (MAX_ANGULAR_VELOCITY - accelerationStartVelocityRef.current) * easedProgress;
        const angle = angleRef.current + angularVelocity * (deltaTimeMs / 1000);

        lastFrameTimeRef.current = timestamp;
        angularVelocityRef.current = angularVelocity;
        angleRef.current = angle;
        element.style.transform = `rotate(${angle}deg)`;
        requestNextFrame();
        return;
      }

      const settleMotion = settleMotionRef.current;
      if (!settleMotion) {
        resetMotion();
        return;
      }

      const startTime = settleMotion.startTime ?? timestamp;
      settleMotion.startTime = startTime;

      const progress = Math.min((timestamp - startTime) / settleMotion.durationMs, 1);
      const progressSquared = progress * progress;
      const progressCubed = progressSquared * progress;
      const durationSeconds = settleMotion.durationMs / 1000;
      const initialTangent = settleMotion.startVelocity * durationSeconds;
      const startBasis = 2 * progressCubed - 3 * progressSquared + 1;
      const tangentBasis = progressCubed - 2 * progressSquared + progress;
      const endBasis = -2 * progressCubed + 3 * progressSquared;
      const angle =
        startBasis * settleMotion.startAngle + tangentBasis * initialTangent + endBasis * settleMotion.targetAngle;

      const startBasisDerivative = 6 * progressSquared - 6 * progress;
      const tangentBasisDerivative = 3 * progressSquared - 4 * progress + 1;
      const endBasisDerivative = -6 * progressSquared + 6 * progress;
      const angularVelocity =
        (startBasisDerivative * settleMotion.startAngle +
          tangentBasisDerivative * initialTangent +
          endBasisDerivative * settleMotion.targetAngle) /
        durationSeconds;

      angleRef.current = angle;
      angularVelocityRef.current = Math.max(angularVelocity, 0);
      element.style.transform = `rotate(${angle}deg)`;

      if (progress < 1) {
        requestNextFrame();
        return;
      }

      resetMotion();
    };

    return () => {
      animateFrameRef.current = () => undefined;
    };
  }, [requestNextFrame, resetMotion]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => {
      reduceMotionRef.current = motionPreference.matches;
      if (motionPreference.matches) {
        resetMotion();
      }
    };

    updateMotionPreference();
    motionPreference.addEventListener('change', updateMotionPreference);

    return () => {
      motionPreference.removeEventListener('change', updateMotionPreference);
      resetMotion();
    };
  }, [resetMotion]);

  const onMouseEnter = useCallback(() => {
    if (reduceMotionRef.current) return;

    const shouldResumeImmediately = settleMotionRef.current !== null || angularVelocityRef.current > 0;
    isHoveredRef.current = true;
    settleMotionRef.current = null;
    lastFrameTimeRef.current = null;

    if (shouldResumeImmediately) {
      beginAcceleration(angularVelocityRef.current);
      return;
    }

    clearHoverIntentTimeout();
    hoverIntentTimeoutRef.current = window.setTimeout(() => {
      hoverIntentTimeoutRef.current = null;
      if (!isHoveredRef.current || reduceMotionRef.current) return;
      beginAcceleration(INITIAL_ANGULAR_VELOCITY);
    }, HOVER_INTENT_DELAY_MS);
  }, [beginAcceleration, clearHoverIntentTimeout]);

  const onMouseLeave = useCallback(() => {
    clearHoverIntentTimeout();

    if (reduceMotionRef.current) {
      resetMotion();
      return;
    }

    isHoveredRef.current = false;
    accelerationStartTimeRef.current = null;
    lastFrameTimeRef.current = null;

    const startAngle = angleRef.current;
    const startVelocity = Math.max(angularVelocityRef.current, 0);
    const normalizedAngle = ((startAngle % FULL_ROTATION) + FULL_ROTATION) % FULL_ROTATION;

    if (startVelocity < 1 && (normalizedAngle < 0.5 || FULL_ROTATION - normalizedAngle < 0.5)) {
      resetMotion();
      return;
    }

    let targetAngle = Math.ceil((startAngle + 0.001) / FULL_ROTATION) * FULL_ROTATION;
    let durationMs = MIN_SETTLE_DURATION_MS;

    while (true) {
      const distance = targetAngle - startAngle;
      durationMs = Math.max(
        MIN_SETTLE_DURATION_MS,
        (SETTLE_DURATION_DISTANCE_FACTOR * distance * 1000) / MAX_ANGULAR_VELOCITY,
      );
      const minimumDistance = (startVelocity * (durationMs / 1000)) / 3;

      if (distance >= minimumDistance) break;
      targetAngle += FULL_ROTATION;
    }

    settleMotionRef.current = {
      startAngle,
      startVelocity,
      targetAngle,
      startTime: null,
      durationMs,
    };
    requestNextFrame();
  }, [clearHoverIntentTimeout, requestNextFrame, resetMotion]);

  return {
    elementRef,
    eventHandlers: {
      onMouseEnter,
      onMouseLeave,
    },
  };
};

export default useElementSpin;
