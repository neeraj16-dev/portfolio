import { useEffect, useRef, useState } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

export interface StatsCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  formatCommas?: boolean;
  margin?: `${number}px` | `${number}%` | string;
}

export default function StatsCounter({
  value,
  duration = 1.5,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  formatCommas = false,
  margin = '-40px',
}: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: margin as any });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(latest);
    });
    return unsubscribe;
  }, [springValue]);

  const formatted = formatCommas
    ? decimals > 0
      ? displayValue.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : Math.round(displayValue).toLocaleString('en-US')
    : displayValue.toFixed(decimals);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

export function MetricStatsCounter({
  text,
  className,
  duration = 1.4,
}: {
  text: string;
  className?: string;
  duration?: number;
}) {
  const match = text.trim().match(/^([^0-9.-]*)([0-9,.]+)(.*)$/);
  if (!match) {
    return <span className={className}>{text}</span>;
  }

  const prefix = match[1];
  const numClean = match[2].replace(/,/g, '');
  const value = parseFloat(numClean);
  if (isNaN(value)) {
    return <span className={className}>{text}</span>;
  }

  const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0;
  const suffix = match[3];
  const formatCommas = match[2].includes(',');

  return (
    <StatsCounter
      value={value}
      prefix={prefix}
      suffix={suffix}
      decimals={decimals}
      duration={duration}
      className={className}
      formatCommas={formatCommas}
    />
  );
}

export { StatsCounter };
