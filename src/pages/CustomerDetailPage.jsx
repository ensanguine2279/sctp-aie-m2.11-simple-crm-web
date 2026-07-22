import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router";

import { InteractionsProvider } from "../contexts/InteractionsContext";

import { CustomerContext } from "../contexts/CustomerContext";

import AddInteractionForm from "../components/AddInteractionForm";
import InteractionList from "../components/InteractionList";

import Spinner from "../components/Spinner";
import styles from "./CustomerDetailPage.module.css";

import { API_BASE } from "../App";

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { deleteCustomer } = useContext(CustomerContext);
  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // if(!id) navigate("/app/customers");
  // if(!id) return <Navigate to=("/app/customers"/>
  const handleDelete = async () => {
    await deleteCustomer(id);
    navigate("/app/customers");
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch customer info
        const resCustomers = await fetch(`${API_BASE}/customers/${id}`);
        if (!resCustomers.ok) {
          throw new Error(`HTTP error! status: ${resCustomers.status}`);
        }
        const data = await resCustomers.json();
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]); // re-fetch whenever the id in the URL changes

  if (loading) {
    return (
      <div className={styles.panel}>
        <Spinner size={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.empty}>Error: {error}</p>
        <Link to="/app/customers">Back to Customers</Link>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <Link to="/app/customers" className={styles.backLink}>
        ← Back to Customers
      </Link>
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.name}>
            {customer.firstName} {customer.lastName}
          </h2>
          {customer.company && (
            <p className={styles.company}>{customer.company}</p>
          )}
        </div>
        <Link to={`/app/customers/${id}/edit`} className={styles.editButton}>
          Edit
        </Link>
      </div>
      <div>
        <p className={styles.contactRow}>{customer.email}</p>
        {customer.phone && (
          <p className={styles.contactRow}>{customer.phone}</p>
        )}
      </div>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Status and tags</p>
        <div className={styles.tags}>
          <span
            className={`${styles.badge} ${customer.status === "active" ? styles.badgeActive : styles.badgeInactive}`}
          >
            {customer.status}
          </span>
          {customer.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Notes</p>
        {customer.notes ? (
          <p className={styles.notes}>{customer.notes}</p>
        ) : (
          <p className={styles.notesEmpty}>No notes yet.</p>
        )}
      </div>
      <div className={styles.section}>
        <p className={styles.sectionLabel}>Customer since</p>
        <p className={styles.contactRow}>{customer.createdAt}</p>
      </div>
      <button className={styles.deleteButton} onClick={handleDelete}>
        Delete Customer
      </button>

      <InteractionsProvider customerId={id}>
        <AddInteractionForm />
        <InteractionList />
      </InteractionsProvider>
    </div>
  );
}

export default CustomerDetailPage;
