import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // TODO add smarter user look up instead of having to n^2 every call
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'id is required' });
  }

  try {
    const usersData = fs.readFileSync(path.resolve('data', 'users.json'), 'utf-8');
    const users = JSON.parse(usersData);
    const user = users.find((user) => user.distinct_ids.includes(id));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
