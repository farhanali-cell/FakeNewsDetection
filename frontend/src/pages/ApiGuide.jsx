import ResourceLayout, {
  Section,
  CodeBlock,
} from "../components/ResourceLayout";


const BASE_URL = "https://fake-news-detection-eight-mu.vercel.app";

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/auth/register/",
    auth: "No",
    desc: "Create an account",
  },
  {
    method: "POST",
    path: "/api/auth/login/",
    auth: "No",
    desc: "Get access and refresh tokens",
  },
  {
    method: "POST",
    path: "/api/auth/refresh/",
    auth: "No",
    desc: "Get a new access token",
  },
  {
    method: "POST",
    path: "/api/auth/forgot-password/",
    auth: "No",
    desc: "Request a password reset email",
  },
  {
    method: "POST",
    path: "/api/auth/reset-password/",
    auth: "No",
    desc: "Set a new password",
  },
  {
    method: "POST",
    path: "/api/detect/",
    auth: "Yes",
    desc: "Analyse news text or a URL",
  },
  {
    method: "GET",
    path: "/api/history/",
    auth: "Yes",
    desc: "List your past analyses",
  },
  {
    method: "DELETE",
    path: "/api/history/<id>/",
    auth: "Yes",
    desc: "Delete one of your analyses",
  },
  {
    method: "POST",
    path: "/api/contact/",
    auth: "No",
    desc: "Send a message to the team",
  },
];

export default function ApiGuide() {
  return (
    <ResourceLayout
      title="API Guide"
      subtitle="The REST endpoints behind TruthLens, with request and response formats."
    >
      <Section title="Overview">
        <p>
          The API is JSON over HTTPS. Every path below starts with the base URL:
        </p>
        <CodeBlock>{BASE_URL}</CodeBlock>
        <p>
          The backend runs on a free hosting tier, so the first request after a
          period of inactivity can take up to about a minute.
        </p>
      </Section>

      <Section title="Endpoints">
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Path</th>
                <th className="px-4 py-3 font-semibold">Token needed</th>
                <th className="px-4 py-3 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {ENDPOINTS.map((e) => (
                <tr
                  key={e.method + e.path}
                  className="border-t border-white/10"
                >
                  <td className="px-4 py-3 text-[#3ECF8E] font-mono">
                    {e.method}
                  </td>
                  <td className="px-4 py-3 text-white font-mono whitespace-nowrap">
                    {e.path}
                  </td>
                  <td className="px-4 py-3">{e.auth}</td>
                  <td className="px-4 py-3">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          A separate set of endpoints under <code>/api/admin/</code> is reserved
          for staff accounts and is not documented here.
        </p>
      </Section>

      <Section title="Authentication">
        <p>
          TruthLens uses JWT. Log in to get an <code>access</code> token and a{" "}
          <code>refresh</code> token, then send the access token in the
          Authorization header on every protected request.
        </p>
        <CodeBlock>{`curl -X POST ${BASE_URL}/api/auth/login/ \\
  -H "Content-Type: application/json" \\
  -d '{"username":"your_username","password":"your_password"}'`}</CodeBlock>
        <p>A successful login returns status 200 with:</p>
        <CodeBlock>{`{
  "access": "<access token>",
  "refresh": "<refresh token>",
  "username": "your_username",
  "is_staff": false
}`}</CodeBlock>
        <p>Wrong credentials return status 401:</p>
        <CodeBlock>{`{ "error": "Invalid username or password." }`}</CodeBlock>
        <p>
          When the access token expires, send the refresh token to{" "}
          <code>/api/auth/refresh/</code> as{" "}
          <code>{`{"refresh": "<refresh token>"}`}</code> to get a new access
          token.
        </p>
        <p>
          Header format for protected endpoints:{" "}
          <code>Authorization: Bearer &lt;access token&gt;</code>
        </p>
      </Section>

      <Section title="Analyse news: POST /api/detect/">
        <p>
          Send either article text or a link to an article in the{" "}
          <code>text</code> field. If the value is a URL, the backend extracts
          the article text first.
        </p>
        <CodeBlock>{`curl -X POST ${BASE_URL}/api/detect/ \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <ACCESS_TOKEN>" \\
  -d '{"text":"Paste the article text or a link here"}'`}</CodeBlock>
        <p>A successful response (status 200) contains these fields:</p>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Field</th>
                <th className="px-4 py-3 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["prediction", "The label: FAKE, REAL or UNCERTAIN"],
                [
                  "confidence",
                  "How strongly the model leans towards its label. Can be null for very short text",
                ],
                [
                  "model_leaning",
                  "Which way the model leaned underneath the final label",
                ],
                ["explanation", "Short explanation of the result"],
                ["signals", "Measured writing features of the text"],
                [
                  "top_keywords",
                  "Keywords produced by the model for this text",
                ],
                ["text_preview", "First 100 characters of the analysed text"],
                ["source_url", "The URL if one was submitted, otherwise null"],
                ["message", "Extra note about the result"],
              ].map(([f, m]) => (
                <tr key={f} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white font-mono">{f}</td>
                  <td className="px-4 py-3">{m}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          If the text is empty, or a URL cannot be read, the API returns status
          400:
        </p>
        <CodeBlock>{`{ "error": "Please provide news text or a URL to analyze." }`}</CodeBlock>
      </Section>

      <Section title="History">
        <p>List your analyses, newest first:</p>
        <CodeBlock>{`curl ${BASE_URL}/api/history/ \\
  -H "Authorization: Bearer <ACCESS_TOKEN>"`}</CodeBlock>
        <p>
          The response is a list. Each item has <code>id</code>,{" "}
          <code>text_preview</code>, <code>prediction</code>,{" "}
          <code>confidence</code> and <code>created_at</code>.
        </p>
        <p>Delete one analysis (only your own):</p>
        <CodeBlock>{`curl -X DELETE ${BASE_URL}/api/history/12/ \\
  -H "Authorization: Bearer <ACCESS_TOKEN>"`}</CodeBlock>
        <p>
          Returns status 200 with a success message, or 404 with{" "}
          <code>{`{"error": "Not found."}`}</code> if the id does not exist or
          belongs to another user.
        </p>
      </Section>

      <Section title="Account and password reset">
        <p>
          Register (returns status 201 on success, 400 with field errors
          otherwise):
        </p>
        <CodeBlock>{`curl -X POST ${BASE_URL}/api/auth/register/ \\
  -H "Content-Type: application/json" \\
  -d '{"username":"your_username","email":"you@example.com","password":"your_password"}'`}</CodeBlock>
        <p>
          Forgot password: send <code>{`{"email": "you@example.com"}`}</code> to{" "}
          <code>/api/auth/forgot-password/</code>. The response is always the
          same message, whether or not the email is registered, so nobody can
          discover which emails have accounts.
        </p>
        <p>
          Reset password: send <code>uid</code>, <code>token</code> (both from
          the link in the email) and the new <code>password</code> (at least 6
          characters) to <code>/api/auth/reset-password/</code>.
        </p>
      </Section>

      <Section title="Contact">
        <CodeBlock>{`curl -X POST ${BASE_URL}/api/contact/ \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Your Name","email":"you@example.com","subject":"Hello","message":"Your message"}'`}</CodeBlock>
        <p>Returns status 201 when the message is saved.</p>
      </Section>

      <Section title="Notes">
        <p>
          The curl examples use Linux and macOS quoting. On Windows Command
          Prompt, wrap the JSON in double quotes and escape the inner quotes,
          for example{" "}
          <code>{`-d "{\\"username\\":\\"a\\",\\"password\\":\\"b\\"}"`}</code>,
          and write each command on one line.
        </p>
      </Section>
    </ResourceLayout>
  );
}
