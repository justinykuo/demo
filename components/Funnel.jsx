import { useEffect, useState } from "react";
import { BarChart, Bar, LabelList, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";
import { funnelSteps } from "../constants/funnelSteps";

const CHUNK_SIZE = 1000;

export default function Funnel({ events }) {
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to split the events array into chunks
  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  useEffect(() => {
    async function fetchFunnelData() {
      setLoading(true);

      // Split the events array into smaller chunks
      const eventChunks = chunkArray(events, CHUNK_SIZE);

      try {
        // Send multiple requests in parallel for each chunk
        const fetchPromises = eventChunks.map((chunk) =>
          fetch("/api/funnel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events: chunk }),
          }).then((res) => res.json())
        );

        // Wait for all requests to resolve
        const results = await Promise.all(fetchPromises);

        // Merge all results into one aggregated count
        const combinedFunnelCounts = results.reduce((acc, data) => {
          if (data?.funnelSteps && data?.funnelCounts) {
            data.funnelSteps.forEach((step, index) => {
              acc[step] = (acc[step] || 0) + data.funnelCounts[index];
            });
          }
          return acc;
        }, {});

        // Calculate activation rates
        const activationRates = funnelSteps.map((step, index) => {
          const prevStep = funnelSteps[index - 1];
          if (index === 0) return 100; // The first step doesn't have a previous step
          const prevStepCount = combinedFunnelCounts[prevStep] || 0;
          const currentStepCount = combinedFunnelCounts[step] || 0;

          return prevStepCount > 0 ? ((currentStepCount / prevStepCount) * 100).toFixed(2) : 0;
        });

        const formattedData = funnelSteps.map((step, index) => ({
          name: step,
          users: combinedFunnelCounts[step] || 0,
          activationRate: `${activationRates[index]}%`, // Add activation rate here
        }));

        console.log(formattedData);

        setFunnelData(formattedData);
      } catch (error) {
        console.error("Error fetching funnel data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFunnelData();
  }, [events]); // Re-fetch if the events prop changes

  if (loading) return <Typography>Loading...</Typography>;
  if (!funnelData.length) return <Typography>Error fetching funnel data</Typography>;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Funnel Analysis
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="users" fill="#8884d8">
              <LabelList dataKey="activationRate" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
