import { useCallback, useState } from 'react';

const useElementSpin = () => {
  /** 动画初始执行时间 */
  const INIT_TIME = 2000;
  /** 每次动画减少的时间 ms */
  const DES_TIME = 200;
  /** 动画最终执行时间 ms */
  const FINAL_TIME = 200;
  // 动画执行时间 ms
  const [initTime, setInitTime] = useState(INIT_TIME);
  const [isHovered, setIsHovered] = useState(false);

  const onAnimationIteration = useCallback(() => {
    setInitTime((previous) => Math.max(previous - DES_TIME, FINAL_TIME));
  }, []);

  return {
    isHovered,
    animationDuration: initTime,
    eventHandlers: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onAnimationIteration,
    },
  };
};

export default useElementSpin;
