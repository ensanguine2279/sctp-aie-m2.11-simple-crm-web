import { useInteractions } from "../contexts/InteractionsContext";
import { useFormik } from "formik";
import * as yup from "yup";

import styles from "./AddInteractionForm.module.css";

const interactionSchema = yup.object().shape({
  type: yup.string().required("Interaction type is required"),
  notes: yup
    .string()
    .required("Notes are required.")
    .min(10, "Notes must be at least 10 characters."),
  date: yup
    .date()
    .typeError("Date is required.")
    .required("Date is required.")
    .max(new Date(), "Date cannot be in the future."),
});

function AddInteractionForm() {
  const { addInteraction } = useInteractions();

  const formik = useFormik({
    initialValues: {
      type: "call",
      notes: "",
      date: new Date().toISOString().split("T")[0],
    },
    validationSchema: interactionSchema,
    onSubmit: async (values, { resetForm }) => {
      //Call addInteraction from context instead of manual fetch
      addInteraction(values, {
        onSuccess: () => {
          resetForm();
        },
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <h3 className={styles.heading}>Log Interaction</h3>

      <div className={styles.field}>
        <label htmlFor="type">Type</label>
        <select
          id="type"
          name="type"
          value={formik.values.type}
          disabled={formik.isSubmitting}
          {...formik.getFieldProps("type")}
        >
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="notes">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          disabled={formik.isSubmitting}
          placeholder="What was discussed?"
          {...formik.getFieldProps("notes")}
        />
        {formik.touched.notes && formik.errors.notes && (
          <p className={styles.fieldError}>{formik.errors.notes}</p>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          disabled={formik.isSubmitting}
          {...formik.getFieldProps("date")}
        />
        {formik.touched.date && formik.errors.date && (
          <p className={styles.fieldError}>{formik.errors.date}</p>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={formik.isSubmitting || formik.isAdding}
      >
        {formik.isSubmitting ? "Saving..." : "Log Interaction"}
      </button>
    </form>
  );
}

export default AddInteractionForm;
