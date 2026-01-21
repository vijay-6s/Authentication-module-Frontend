import { useEffect, useState } from "react";
import "./App.css";
import { authClient } from "./lib/auth-client";

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [jwt, setJwt] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [status, setStatus] = useState<string | null>(null);

  const inviteId = new URLSearchParams(window.location.search).get("invite");

  /* -------------------- Load session -------------------- */
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const res = await authClient.getSession();
      setSession(res.data);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- OAuth -------------------- */
  const signIn = async (provider: "google" | "microsoft") => {
    await authClient.signIn.social({
      provider,
      callbackURL: inviteId
        ? `http://localhost:5173?invite=${inviteId}`
        : "http://localhost:5173",
    });
  };

  const signOut = async () => {
    await authClient.signOut();
    setSession(null);
    setJwt(null);
  };

  /* -------------------- Accept Invite -------------------- */
  const acceptInvite = async () => {
    setStatus("Accepting invitation...");

    const res = await fetch(
      "http://localhost:8000/api/auth/organization/accept-invitation",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: inviteId }),
      }
    );

    if (res.ok) {
      setStatus("Invitation accepted! You are now in the organization.");
      await checkSession();
      window.history.replaceState({}, "", "/");
    } else {
      setStatus("Invalid or expired invitation.");
    }
  };

  /* -------------------- JWT -------------------- */
  const fetchJwt = async () => {
    const { data } = await authClient.token();
    if (data?.token) setJwt(data.token);
  };

  const callProtectedApi = async () => {
    const res = await fetch("http://localhost:8000/api/protected", {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setApiResponse(await res.json());
  };

  /* -------------------- Create Org -------------------- */
  const [orgName, setOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  const createOrg = async () => {
    setStatus("Creating organization...");
    const res = await fetch("http://localhost:8000/organization/create", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName, email: inviteEmail }),
    });

    const data = await res.json();
    if (res.ok) setStatus("Organization created. Invite sent.");
    else setStatus(data.error);
  };

  /* -------------------- Render -------------------- */
  if (loading) return <div>Loading...</div>;

  return (
    <div className="card">
      <h1>Better Auth + Organizations</h1>

      {/* INVITE FLOW */}
      {inviteId && !session?.user && (
        <>
          <h3>You were invited to an organization</h3>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <button onClick={() => signIn("microsoft")}>Sign in with Microsoft</button>
        </>
      )}

      {inviteId && session?.user && (
        <>
          <h3>Accept Invitation</h3>
          <button onClick={acceptInvite}>Join Organization</button>
        </>
      )}

      {/* LOGIN */}
      {!inviteId && !session?.user && (
        <>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <button onClick={() => signIn("microsoft")}>Sign in with Microsoft</button>
        </>
      )}

      {/* DASHBOARD */}
      {session?.user && !inviteId && (
        <>
          <p>Logged in as <b>{session.user.email}</b></p>
          <button onClick={signOut}>Sign out</button>

          <h3>Create Organization</h3>
          <input
            placeholder="Organization name"
            value={orgName}
            onChange={e => setOrgName(e.target.value)}
          />
          <input
            placeholder="Invite email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
          />
          <button onClick={createOrg}>Create</button>

          <h3>JWT</h3>
          <button onClick={fetchJwt}>Get JWT</button>
          {jwt && <pre>{jwt}</pre>}

          {jwt && <button onClick={callProtectedApi}>Call Protected API</button>}
        </>
      )}

      {status && <p>{status}</p>}

      {apiResponse && (
        <>
          <h3>API Response</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
