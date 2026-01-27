import type { EventState, EventAction } from './types';

export const initialState: EventState = {
  events: [],
};

export function eventReducer(
  state: EventState,
  action: EventAction
): EventState {
  switch (action.type) {
    case 'ADD_EVENT':
      return { events: [...state.events, action.payload] };

    case 'DELETE_EVENT':
      return {
        events: state.events.filter(e => e.id !== action.payload.id),
      };

    case 'ADD_MEMBER':
      return {
        events: state.events.map(e =>
          e.id === action.payload.eventId
            ? { ...e, members: [...e.members, action.payload.member] }
            : e
        ),
      };

    case 'UPDATE_RSVP':
      return {
        events: state.events.map(e =>
          e.id === action.payload.eventId
            ? {
                ...e,
                members: e.members.map(m =>
                  m.id === action.payload.memberId
                    ? { ...m, rsvp: action.payload.rsvp }
                    : m
                ),
              }
            : e
        ),
      };

    default:
      return state;
  }
}
