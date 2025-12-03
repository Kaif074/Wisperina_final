import TranscriptionPage from './pages/TranscriptionPage';
import EmotionDashboard from './pages/EmotionDashboard';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Audio Transcriber',
    path: '/',
    element: <TranscriptionPage />
  },
  {
    name: 'Emotion Dashboard',
    path: '/emotion',
    element: <EmotionDashboard />
  }
];

export default routes;
