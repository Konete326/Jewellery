import React from 'react';
import { NeuralNoise } from '@/components/ui/neural-noise';

export function GlobalGoldEffect({
  color = [0.85, 0.68, 0.22],
  opacity = 0.45,
  speed = 0.0008,
  zIndex = 0,
}) {
  return (
    <NeuralNoise
      color={color}
      opacity={opacity}
      speed={speed}
      zIndex={zIndex}
    />
  );
}
