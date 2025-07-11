'use client';

import { createContext } from 'react';

export type SettingsValue = unknown;

export type SettingsContextType = {
  set: (key: string, value: SettingsValue) => void;
  get: (key: string) => SettingsValue | undefined;
  has: (key: string) => boolean;
  remove: (key: string) => void;
  getAll: () => Record<string, SettingsValue>;
};

export const SettingsContext = createContext<SettingsContextType | null>(null);
