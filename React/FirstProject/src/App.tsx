import "./App.css";
import { BrowserRouter } from 'react-router-dom';
import { EventProvider } from './context/EventContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <EventProvider>
        <div style={{border: '1px solid white',padding: '50px'}}>
          <h1 style={{ textAlign: 'center' }}>Team Event Planner</h1>
          <AppRoutes />
        </div>
      </EventProvider>
    </BrowserRouter>
  );
}
