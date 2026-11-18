export default function Logo({ width = 30 }: { width?: number }) {
  return (
    <svg width={width} height={(width * 22) / 34} viewBox="0 0 34 22" fill="none" aria-hidden="true">
      <path d="M1 1h8l8 13 8-13h8L17 21z" fill="#fff" />
    </svg>
  );
}
