import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

export const WeakIcon = BatteryLow;
export const MediumIcon = BatteryMedium;
export const SolidIcon = BatteryFull;

export function getSavedIconTheme() {
  return {
    weak: 'batteryLow',
    medium: 'batteryMedium',
    solid: 'batteryFull',
  };
}
