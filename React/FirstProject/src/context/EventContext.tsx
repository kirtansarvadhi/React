import { createContext, useContext, useEffect, useReducer } from 'react';
import { eventReducer, initialState } from '../store/eventReducer';
import type { EventAction, EventState } from '../store/types';

type EventContextType = {
  state: EventState;
  dispatch: React.Dispatch<EventAction>;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  useEffect(() => {
    const raw = localStorage.getItem('events');
    if (raw) {
      dispatch({ type: 'SET_EVENTS', payload: JSON.parse(raw) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(state.events));
  }, [state.events]);

  return (
    <EventContext.Provider value={{ state, dispatch }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) {
    throw new Error('useEvents must be used inside EventProvider');
  }
  return ctx;
}
