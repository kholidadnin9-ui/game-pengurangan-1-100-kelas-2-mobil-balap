import { useId } from 'react';

export function RacingFlag({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 42 40" fill="none" aria-hidden="true">
      <path d="M8 35 15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <g transform="skewX(-13)">
        <path d="M17 5h21v21H17z" fill="currentColor" />
        <path d="M17 5h7v7h-7zm14 0h7v7h-7zm-7 7h7v7h-7zm-7 7h7v7h-7zm14 0h7v7h-7z" fill="#0a121b" />
      </g>
      <path d="m3 17 5-2m-7 9 5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Coin({ className = '' }: { className?: string }) {
  return <span className={`coin-symbol ${className}`} aria-hidden="true">C</span>;
}

export function RaceCar({ color, rival = false }: { color: string; rival?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 172 70" className="race-car-art" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-paint`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} />
          <stop offset=".6" stopColor={color} />
          <stop offset="1" stopColor="#101925" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#86c6d5" />
          <stop offset=".4" stopColor="#263e4e" />
          <stop offset="1" stopColor="#111b27" />
        </linearGradient>
      </defs>
      <ellipse cx="88" cy="62" rx="77" ry="5" fill="#020711" opacity=".65" />
      <path d="m13 38 28-9 18-18c5-5 30-6 43-2l30 22 23 6 9 14-4 7H10L6 48Z" fill={`url(#${id}-paint)`} stroke={color} strokeWidth="1.2" />
      <path d="m48 29 16-16c7-3 23-3 34 0l22 17Z" fill={`url(#${id}-glass)`} stroke="#10202b" strokeWidth="2" />
      <path d="m86 12 5 18M14 38l125-4" stroke={color} strokeWidth="2" />
      <path d="m95 33 3 15-41 1-2-16" fill="none" stroke="#0d1b24" strokeOpacity=".5" />
      <path d="m16 43 16-2-5 5H13zm125-2 12 3 4 5-17-4z" fill={rival ? '#d7e8f1' : '#eafcff'} />
      <path d="M15 50h140" stroke="#142536" strokeWidth="3" />
      {[39, 132].map(x => (
        <g key={x}>
          <circle cx={x} cy="52" r="14" fill="#071018" />
          <circle cx={x} cy="52" r="9" fill="#7e91a2" />
          <circle cx={x} cy="52" r="6.8" fill="#1b2a39" />
          <path d={`M${x} 45v14m-7-7h14m-12-5 10 10m0-10-10 10`} stroke="#92a4b2" strokeWidth="1.3" />
          <circle cx={x} cy="52" r="2.4" fill="#b9c9d4" />
        </g>
      ))}
      <path d="m9 35-3-8h26v4l-13 2" fill={color} />
    </svg>
  );
}