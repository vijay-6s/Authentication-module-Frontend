import { useState } from "react";

export function CreateOrganization() {
  const [name, setName] = useState("");
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
        credentials: "include", // 🔥 REQUIRED
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult("Organization created and invitation sent.");
      } else {
        setResult(data.error || "Failed to create organization");
      }
    } catch {
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <h3>Create Organization</h3>

      <input
        placeholder="Organization name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        placeholder="Admin email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button disabled={loading}>
        {loading ? "Creating..." : "Create Organization"}
      </button>

      {result && <p>{result}</p>}
    </form>
  );
}
