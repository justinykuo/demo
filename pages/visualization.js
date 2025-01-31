import Funnel from "../components/Funnel";
import Usage from "../components/Usage";
import events from '../data/events.json';

export default function Page() {
  return (
    <div>
      <div>
        <h1>User Funnel Analysis</h1>
        <Funnel events={events} />
      </div>
      <div>
        <h1>Usage Analysis</h1>
        <Usage events={events} />
      </div>
      <style jsx>{`
        div {
          padding: 40px 12px;
        }
    `}</style>
    </div>
  );
}
