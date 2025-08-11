"use client";
import { useInView } from "react-intersection-observer";

const FadeinWrapper = ({
  children,
  effect,
}: {
  children: React.ReactNode;
  effect: string;
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation triggers only once
    threshold: 0.2, // Trigger when 40% of the element is visible
  });
  return (
    <div className={`${inView ? effect : ""}`} ref={ref}>
      {children}
    </div>
  );
};

export { FadeinWrapper };
