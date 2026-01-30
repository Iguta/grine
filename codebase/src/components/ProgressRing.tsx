interface ProgressRingProps {
  value: number
}

export const ProgressRing = ({ value }: ProgressRingProps) => {
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <svg className="progress-ring" width="84" height="84">
      <circle className="progress-ring-bg" strokeWidth="8" fill="transparent" r={radius} cx="42" cy="42" />
      <circle
        className="progress-ring-value"
        strokeWidth="8"
        fill="transparent"
        r={radius}
        cx="42"
        cy="42"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={offset}
      />
      <text className="progress-ring-text" x="42" y="47" textAnchor="middle">
        {value}%
      </text>
    </svg>
  )
}