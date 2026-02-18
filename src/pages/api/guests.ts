import type { NextApiRequest, NextApiResponse } from 'next';
import guestsData from '../../data/guests.json';

interface Guest {
  id: string;
  name: string;
  attendance: string;
  notes: string;
  image: string;
}

// Simulamos una base de datos en memoria para este ejemplo
let guests = [...guestsData];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Guest[] | Guest | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(guests);
  }

  if (req.method === 'POST') {
    const newGuest = {
      id: Date.now().toString(),
      ...req.body,
    };
    guests.push(newGuest);
    return res.status(201).json(newGuest as Guest);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const guestIndex = guests.findIndex(g => g.id === id);

    if (guestIndex === -1) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    guests[guestIndex] = { ...guests[guestIndex], ...req.body };
    return res.status(200).json(guests[guestIndex] as Guest);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    guests = guests.filter(g => g.id !== id);
    return res.status(200).json(guests);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
