export type RSVP = 'going' | 'maybe' | 'not-going';

export type Member = {
  id: string;
  name: string;
  rsvp: RSVP;
};

export type EventItem = {
  id: string;
  title: string;
  date: string;
  description: string;
  members: Member[];
};

export type EventState = {
  events: EventItem[];
};

export type EventAction =
  | { type: 'ADD_EVENT'; payload: EventItem }
  | { type: 'DELETE_EVENT'; payload: { id: string } }
  | { type: 'SET_EVENTS'; payload: EventItem[] }
  | {
      type: 'ADD_MEMBER';
      payload: { eventId: string; member: Member };
    }
  | {
      type: 'UPDATE_RSVP';
      payload: { eventId: string; memberId: string; rsvp: RSVP };
    };
