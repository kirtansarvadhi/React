import { Routes, Route } from 'react-router-dom';
import EventsPage from '../pages/EventsPage.tsx';
import CreateEventPage from '../pages/CreateEventPage.tsx';
import EventDetailPage from '../pages/EventDetailPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<EventsPage />} />
      <Route path="/create" element={<CreateEventPage />} />
      <Route path="/event/:id" element={<EventDetailPage />} />
    </Routes>
  );
}
