/**
 * @file frontend-nextjs/src/lib/utils.ts
 * @description Hàm tiện ích gộp các class Tailwind CSS linh hoạt.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
