import styles from "./InteractionCard.module.css";

export default function InteractionCard({ interaction, onDelete }) {
  const { id, type, notes, date } = interaction;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.type}>{type}</span>
          <span className={styles.date}>{date}</span>
        </div>
        <p className={styles.notes}>{notes}</p>
      </div>
      <button
        type="button"
        className={styles.deleteBtn}
        onClick={() => onDelete(id)}
        aria-label="Delete interaction"
      >
        Delete
      </button>
    </div>
  );
}
