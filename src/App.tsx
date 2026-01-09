import { useEffect, useState } from "react"
import "./App.css"
import { authClient } from "./lib/auth-client"

function App() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [jwt, setJwt] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const res = await authClient.getSession()
      setSession(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173",
    })
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    setSession(null)
    setJwt(null)
    setApiResponse(null)
  }

  const fetchJwt = async () => {
    const { data, error } = await authClient.token()
    if (error) return console.error(error)
    setJwt(data.token)
  }

  const callProtectedApi = async () => {
    const res = await fetch("http://localhost:3000/api/protected", {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    setApiResponse(await res.json())
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="card">
      <h1>Better Auth + JWT Demo</h1>

      {!session?.user ? (
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      ) : (
        <>
          <p><b>Email:</b> {session.user.email}</p>

          <button onClick={handleSignOut}>Sign out</button>
          <button onClick={fetchJwt}>Get JWT</button>
          {jwt && <button onClick={callProtectedApi}>Call Protected API</button>}
        </>
      )}

      {jwt && (
        <>
          <h3>JWT</h3>
          <pre>{jwt}</pre>
        </>
      )}

      {apiResponse && (
        <>
          <h3>API Response</h3>
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        </>
      )}
    </div>
  )
}

export default App
