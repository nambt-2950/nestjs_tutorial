export const JWT_CONSTANTS = {
  SECRET: process.env.JWT_SECRET || 'secret',
  EXPIRES_IN: '1d' as const,
};