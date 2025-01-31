import { funnelSteps } from "../../constants/funnelSteps";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { events } = req.body;

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ error: "Invalid event data" });
  }
  const stepCounts = {
    "user visited home page": 0,
    "user visited sign up page": 0,
    "user created account": 0,
    "user entered credit card": 0,
    "user watched movie": 0
  };

  try {
    // Loop through events and count funnel steps
    events.forEach((e, i) => {

      // If the event corresponds to a funnel step, increment the count for that step
      if (funnelSteps.includes(e.event)) {
        stepCounts[e.event] += 1;
      }
    });

    // Convert the step counts into a format suitable for the frontend
    const funnelData = funnelSteps.map(step => ({
      step,
      count: stepCounts[step]
    }));

    // Return the funnel data
    res.status(200).json({
      funnelSteps: funnelData.map(item => item.step),
      funnelCounts: funnelData.map(item => item.count),
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
