import { useState } from "react";

export default function OrganisationForm() {
  const [orgName, setOrgName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:3000/organization/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: orgName, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult("Organization created! Check your email for the invite.");
      } else {
        setResult(data.error || "Failed to create organization.");
      }
    } catch {
      setResult("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Organisation Details</h1>
        <p style={styles.subtitle}>Please enter your organisation information below.</p>
        <form onSubmit={handleSubmit}>
          <div style={{ ...styles.field, flexDirection: "column" } as React.CSSProperties}>
            <label style={styles.label}>Organisation Name</label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              style={styles.input}
              required
            />
          </div>
          <div style={{ ...styles.field, flexDirection: "column" } as React.CSSProperties}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. contact@acme.com"
              style={styles.input}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
        {result && <div style={{ marginTop: 16 }}>{result}</div>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    fontFamily: "Arial, sans-serif",
  } as React.CSSProperties,
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  } as React.CSSProperties,
  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "6px",
  } as React.CSSProperties,
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
  } as React.CSSProperties,
  field: {
    marginBottom: "16px",
    display: "flex",
  } as React.CSSProperties,
  label: {
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
  } as React.CSSProperties,
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  } as React.CSSProperties,
  button: {
    width: "100%",
    marginTop: "12px",
    padding: "12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#fff",
    backgroundColor: "#111827",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  } as React.CSSProperties,
};