export const ComponentMode = {
  DEFAULT: 'DEFAULT',
  ADD_TASK: 'ADD_TASK',
  EDIT_TASK: 'EDIT_TASK',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
} as const;

export type ComponentMode = (typeof ComponentMode)[keyof typeof ComponentMode];
