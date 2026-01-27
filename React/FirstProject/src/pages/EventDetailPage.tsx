import { useParams, useNavigate } from 'react-router-dom';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import type { Member, RSVP } from '../store/types';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useEvents();

  const event = useMemo(() => {
    return state.events.find(e => e.id === id);
  }, [state.events, id]);

  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  const handleAddMember = useCallback(() => {
    if (!event || !name.trim()) return;

    const newMember: Member = {
      id: Date.now().toString(),
      name,
      rsvp: 'maybe',
    };

    dispatch({
      type: 'ADD_MEMBER',
      payload: { eventId: event.id, member: newMember },
    });

    setName('');
  }, [name, event, dispatch]);

  const handleRSVPChange = useCallback(
    (memberId: string, rsvp: RSVP) => {
      if (!event) return;

      dispatch({
        type: 'UPDATE_RSVP',
        payload: { eventId: event.id, memberId, rsvp },
      });
    },
    [event, dispatch]
  );

  const handleDelete = useCallback(() => {
    if (!event) return;

    dispatch({
      type: 'DELETE_EVENT',
      payload: { id: event.id },
    });

    navigate('/');
  }, [event, dispatch, navigate]);

  if (!event) {
    return (
      <div style={{ padding: 20 }}>
        <p>Event not found.</p>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  return (
    
    <div style={{ padding: 20, textAlign: 'center' }}>

        <button onClick={() => navigate('/')} style={{ marginBottom: 20 }}>
       Home
    </button>

      <h2>{event.title}</h2>
      <p>{event.date}</p>
      <p>{event.description}</p>

      <button
        onClick={handleDelete}
        style={{ marginBottom: 20, color: 'red' }}
      >
        Delete Event
      </button>

      <hr />

      <h3>Members</h3>

      <div style={{ marginBottom: 10 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Member name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button style={{ margin: 10 }} onClick={handleAddMember}>Add</button>
      </div>

      <ul
        style={{ maxHeight: 200, overflowY: 'auto', padding: 0 }}
      >
        {event.members.map(m => (
          <li key={m.id} style={{ marginBottom: 8, listStyle: 'none' }}>
            <strong>{m.name}</strong>{' '}
            <select
              value={m.rsvp}
              onChange={e =>
                handleRSVPChange(m.id, e.target.value as RSVP)
              }
            >
              <option value="going">Going</option>
              <option value="maybe">Maybe</option>
              <option value="not-going">Not Going</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
}
