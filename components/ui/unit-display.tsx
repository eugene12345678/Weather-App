'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TemperatureProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  units: 'metric' | 'imperial';
  showUnit?: boolean;
  showPlus?: boolean;
}

export function Temperature({ 
  value, 
  units, 
  showUnit = true,
  showPlus = false,
  className,
  ...props 
}: TemperatureProps) {
  const displayValue = Math.round(value);
  const prefix = showPlus && displayValue > 0 ? '+' : '';
  const unit = showUnit ? (units === 'metric' ? '°C' : '°F') : '';
  
  return (
    <span className={cn("", className)} {...props}>
      {prefix}{displayValue}{unit}
    </span>
  );
}

interface WindProps extends React.HTMLAttributes<HTMLSpanElement> {
  speed: number;
  direction?: number;
  units: 'metric' | 'imperial';
  showUnit?: boolean;
}

export function Wind({ 
  speed, 
  direction,
  units, 
  showUnit = true,
  className,
  ...props 
}: WindProps) {
  const displayValue = Math.round(speed);
  const unit = showUnit ? (units === 'metric' ? 'km/h' : 'mph') : '';
  
  return (
    <span className={cn("", className)} {...props}>
      {displayValue}{showUnit && <span className="text-xs ml-1">{unit}</span>}
    </span>
  );
}

interface PrecipitationProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  showUnit?: boolean;
}

export function Precipitation({ 
  value, 
  showUnit = true,
  className,
  ...props 
}: PrecipitationProps) {
  const displayValue = value < 1 ? value.toFixed(1) : Math.round(value);
  
  return (
    <span className={cn("", className)} {...props}>
      {displayValue}{showUnit && <span className="text-xs ml-1">mm</span>}
    </span>
  );
}

interface ProbabilityProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
}

export function Probability({ 
  value, 
  className,
  ...props 
}: ProbabilityProps) {
  const displayValue = Math.round(value);
  
  return (
    <span className={cn("", className)} {...props}>
      {displayValue}%
    </span>
  );
}