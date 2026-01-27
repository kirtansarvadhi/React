import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import type { EventItem } from '../store/types';

export  function CreateEventPage() {
  const { dispatch } = useEvents();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!title.trim() || !date.trim()) return;

      const newEvent: EventItem = {
        id: Date.now().toString(),
        title,
        date,
        description,
        members: [],
      };

      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      navigate('/');
    },
    [title, date, description, dispatch, navigate]
  );

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>

        <button onClick={() => navigate('/')} style={{ marginBottom: 20 }}>Home </button>

      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <div >
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div >
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <div >
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}
export default CreateEventPage;