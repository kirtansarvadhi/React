import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useEvents } from '../context/EventContext';

export default function EventsPage() {
  const { state } = useEvents();

  const events = useMemo(() => {
    return state.events;
  }, [state.events]);

  return (
    <div style={{ padding: 20, textAlign: 'center'}}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/create"> Create Event</Link>
      </div>

      {events.length === 0 ? (
        <p>create first event</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id} style={{ marginBottom: 10 }}>
              <Link to={`/event/${event.id}`}>
                {event.title} | {event.date}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
