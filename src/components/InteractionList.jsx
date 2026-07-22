import { useInteractions } from "../contexts/InteractionsContext";

import InteractionCard from "./InteractionCard";

import styles from "./InteractionList.module.css";

export default function InteractionList() {
  const { interactions, deleteInteraction } = useInteractions();

  return (
    <div className={styles.container}>
      <h3>Interaction History</h3>
      {interactions.length === 0 ? (
        <p>No interactions recorded yet.</p>
      ) : (
        interactions.map((interaction) => (
          <InteractionCard
            key={interaction.id}
            interaction={interaction}
            onDelete={deleteInteraction}
          />
        ))
      )}
    </div>
  );
}
