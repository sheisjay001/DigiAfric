export function Skeleton({ width, height, className, style }: { width?: string | number, height?: string | number, className?: string, style?: React.CSSProperties }) {
  return (
    <div 
      className={`skeleton ${className || ''}`} 
      style={{ 
        width: width || '100%', 
        height: height || '20px',
        ...style 
      }} 
      aria-hidden="true"
    />
  );
}
