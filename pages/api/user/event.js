import fs from "fs";
import path from "path";

function getUserByDistinctId(users, distinctId) {
  return users.find((user) => user.distinct_ids.includes(distinctId));
}

export default function handler(req, res) {
  const eventsPath = path.join(process.cwd(), "data", "events.json");
  const usersPath = path.join(process.cwd(), "data", "users.json");

  const events = JSON.parse(fs.readFileSync(eventsPath, "utf8"));
  const users = JSON.parse(fs.readFileSync(usersPath, "utf8"));

  const userEvents = events.map((event) => {
    const user = getUserByDistinctId(users, event.distinct_id);
    return { ...event, user_id: user ? user.user_id : null };
  });

  res.status(200).json(userEvents);
}
