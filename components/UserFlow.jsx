// I def did association between steps here incorrectly
// I was trying to get away with using the funnel data to support a sankey diagram
import { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Sankey, Tooltip, ResponsiveContainer } from "recharts";

export default function UserFlow({ events }) {
  const [userFlowData, setUserFlowData] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to split the event data into chunks
  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };

  useEffect(() => {
    async function fetchUserFlowData() {
      setLoading(true);

      const eventChunks = chunkArray(events, 1000);
      try {
        // Send multiple requests for each chunk of events
        const fetchPromises = eventChunks.map((chunk) =>
          fetch("/api/funnel", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events: chunk }),
          }).then((res) => res.json())
        );

        // Wait for all API calls to resolve
        const results = await Promise.all(fetchPromises);
        // Aggregate funnel counts across all objects
        const aggregatedCounts = results.reduce((acc, data) => {
          const { funnelSteps, funnelCounts } = data;

          funnelCounts.forEach((count, index) => {
            // Add the count to the corresponding funnel step
            acc[funnelSteps[index]] = (acc[funnelSteps[index]] || 0) + count;
          });

          return acc;
        }, {});

        // Create the flow data for Sankey
        const funnelSteps = Object.keys(aggregatedCounts);
        const funnelCounts = Object.values(aggregatedCounts);

        const links = [];
        const nodes = [];
        for (let i = 0; i < funnelSteps.length - 1; i++) {
          nodes.push({
            name: funnelSteps[i]
          });
          links.push({
            source: i,
            target: i + 1,
            value: Math.max(0, funnelCounts[i] - funnelCounts[i + 1]), // Ensure positive flow
          });
        }

        setUserFlowData({ nodes, links });
      } catch (error) {
        console.error("Error fetching user flow data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserFlowData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  console.log(JSON.stringify(userFlowData));

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          User Flow Path Analysis (Sankey Diagram)
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <Sankey
            data={userFlowData}
          >
            <Tooltip />
          </Sankey>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
