import { Entry } from "../../types";
import EntryDetails from "./EntryDetails";

interface EntriesProps {
  entries: Entry[] | undefined;
}

const Entries = ({ entries }: EntriesProps) => {
  console.log(entries);

  return (
    <div>
      <h3>Entries</h3>
      {entries?.map((entry) => {
        return <EntryDetails entry={entry} key={entry.id} />;
      })}
    </div>
  );
};

export default Entries;
