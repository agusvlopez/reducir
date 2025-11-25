export const frequencyToChecks = {
  'EveryDay': 30,
  'SixAWeek': 24,
  'FiveAWeek': 20,
  'FourAWeek': 16,
  'ThreeAWeek': 12,
  'TwoAWeek': 8,
  'OnceAWeek': 4,
  'OnceAFortnight': 2,
  'OnceAMonth': 1,
};

export const frequencyOptions = [
  { value: 'EveryDay', label: 'Todos los días', icon: '📅', period: 'semana' },
  { value: 'ThreeAWeek', label: '3 veces a la semana', icon: '☀️', period: 'semana' },
  { value: 'TwoAWeek', label: '2 veces a la semana', icon: '☀️', period: 'semana' },
  { value: 'OnceAWeek', label: '1 vez a la semana', icon: '📆', period: 'semana' },
  { value: 'OnceAFortnight', label: 'Una vez cada 15 días', icon: '🗓️', period: 'quincena' },
  { value: 'OnceAMonth', label: 'Una vez al mes', icon: '📋', period: 'mes' },
];