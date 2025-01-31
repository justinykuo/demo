import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // TODO add smarter user look up instead of having to n^2 every call
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'user_id is required' });
  }

  try {
    const usersData = fs.readFileSync(path.resolve('data', 'users.json'), 'utf-8');
    const users = JSON.parse(usersData);
    const user = users.find((user) => user.user_id === user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const distinctIds = [...user.distinct_ids, user_id];

    const eventsData = fs.readFileSync(path.resolve('data', 'events.json'), 'utf-8');
    const events = JSON.parse(eventsData);

    const userEvents = events.filter(event => distinctIds.includes(event.distinct_id));

    // Return the filtered events
    res.status(200).json(userEvents);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
