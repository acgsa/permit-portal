export const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE === 'demo' ? 'demo' : 'live';

export const IS_DEMO_MODE = APP_MODE === 'demo';
