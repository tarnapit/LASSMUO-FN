interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressBar({ current, total, className = "" }: ProgressBarProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300 origin-left"
        style={{ transform: `scaleX(${percentage / 100})` }}
      />
    </div>
  );
}
