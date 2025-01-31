import { Card, CardContent, Typography, Link, Box } from "@mui/material";

export default function Readme() {
  return (
    <Box>
      <Card sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            This is a Next.js project bootstrapped with create-next-app
          </Typography>

          <Typography variant="h6" gutterBottom>
            Getting Started
          </Typography>
          <Typography paragraph>
            First, download dependencies
          </Typography>
          <pre>
            <code>
              npm install
              # or
              yarn install
            </code>
          </pre>
          <Typography paragraph>
            Then, run the development server:
          </Typography>
          <pre>
            <code>
              npm run dev
              # or
              yarn dev
              # or
              pnpm dev
              # or
              bun dev
            </code>
          </pre>
          <Typography paragraph>
            Open <Link href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</Link> with your browser to see the result.
          </Typography>
        </CardContent>
      </Card>

      <style jsx>{`
        pre {
          background-color: #f5f5f5;
          padding: 16px;
          border-radius: 8px;
        }
        code {
          font-family: 'Courier New', Courier, monospace;
        }
        ul {
          list-style-type: disc;
          margin-left: 20px;
        }
      `}</style>
    </Box>
  );
}
