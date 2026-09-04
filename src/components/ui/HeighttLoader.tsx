import { useId } from "react";

interface HeighttLoaderProps {
  className?: string;
  label?: string;
}

export function HeighttLoader({
  className = "",
  label = "Loading",
}: HeighttLoaderProps) {
  const revealMaskId = `heightt-reveal-${useId().replace(/:/g, "")}`;

  return (
    <svg
      className={`heightt-loader ${className}`}
      viewBox="0 0 500 500"
      role="status"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id={revealMaskId}
        className="heightt-reveal-mask"
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="500"
        height="500"
      >
        <path
          className="heightt-draw-mask heightt-draw-mask-left"
          d="M 207 218 H 179 V 389 H 207 V 306"
          pathLength="1"
        />
        <path
          className="heightt-draw-mask heightt-draw-mask-middle"
          d="M 283 404 V 177 H 218 V 312 H 254"
          pathLength="1"
        />
        <path
          className="heightt-draw-mask heightt-draw-mask-right"
          d="M 283 298 H 335 V 99 H 283 V 153"
          pathLength="1"
        />
      </mask>

      <circle className="loader-track" fill="none" cx="250" cy="250" r="210" />
      <circle className="loader-ring" fill="none" cx="250" cy="250" r="210" />

      <image
        className="heightt-actual-mark"
        href="/Logo_1-removebg-preview.svg"
        width="500"
        height="500"
        preserveAspectRatio="xMidYMid meet"
        mask={`url(#${revealMaskId})`}
      />
    </svg>
  );
}
