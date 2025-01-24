export function UKFlag({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={className}
    >
      <clipPath id="s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        stroke="#fff"
        strokeWidth="6"
        clipPath="url(#s)"
      />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        stroke="#C8102E"
        strokeWidth="4"
        clipPath="url(#s)"
      />
      <path
        d="M30,0 v30 M0,15 h60"
        stroke="#fff"
        strokeWidth="10"
        clipPath="url(#s)"
      />
      <path
        d="M30,0 v30 M0,15 h60"
        stroke="#C8102E"
        strokeWidth="6"
        clipPath="url(#s)"
      />
    </svg>
  );
}
