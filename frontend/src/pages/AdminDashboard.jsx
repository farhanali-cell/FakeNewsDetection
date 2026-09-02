import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [retrainMessage, setRetrainMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, subsRes] = await Promise.all([
        api.get("/admin/stats/"),
        api.get("/admin/users/"),
        api.get("/admin/submissions/"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSubmissions(subsRes.data);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"? This cannot be undone.`))
      return;
    try {
      await api.delete(`/admin/users/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleDeleteSubmission = async (id) => {
    if (!window.confirm("Delete this submission? This cannot be undone."))
      return;
    try {
      await api.delete(`/admin/submissions/${id}/`);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete submission.");
    }
  };

  const handleRetrain = async () => {
    if (!window.confirm("Start model retraining? This may take a while."))
      return;
    setRetraining(true);
    setRetrainMessage("");
    try {
      const res = await api.post("/admin/retrain/");
      setRetrainMessage(res.data.message || "Retrain started.");
    } catch (err) {
      setRetrainMessage(err.response?.data?.error || "Retrain failed.");
    } finally {
      setRetraining(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.text_preview.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tabs = [
    { id: "stats", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "submissions", label: "Submissions" },
    { id: "retrain", label: "Retrain Model" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E8EAED] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#10141F] border-r border-white/10 flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-['Space_Grotesk'] text-xl font-bold text-[#3ECF8E]">
            TruthLens
          </h1>
          <p className="text-xs text-white/40 mt-1">Admin Control Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#3ECF8E]/10 text-[#3ECF8E]"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate("/")}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-[#E8935B] hover:bg-[#E8935B]/10 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top header */}
        <header className="sticky top-0 bg-[#0B0E14]/95 backdrop-blur border-b border-white/10 px-8 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="text-xs text-white/40">
              Logged in as {user?.username}
            </p>
          </div>
          {(activeTab === "users" || activeTab === "submissions") && (
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:border-[#3ECF8E]/50"
            />
          )}
        </header>

        <div className="p-8">
          {loading ? (
            <p className="text-white/40">Loading admin data...</p>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === "stats" && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    label="Total Users"
                    value={stats.total_users}
                    color="#3ECF8E"
                  />
                  <StatCard
                    label="Total Submissions"
                    value={stats.total_submissions}
                    color="#3ECF8E"
                  />
                  <StatCard
                    label="Marked Fake"
                    value={stats.fake_count}
                    color="#E8935B"
                  />
                  <StatCard
                    label="Marked Real"
                    value={stats.real_count}
                    color="#3ECF8E"
                  />
                  <StatCard
                    label="Avg. Confidence"
                    value={`${stats.avg_confidence}%`}
                    color="#3ECF8E"
                  />
                  <StatCard
                    label="Contact Messages"
                    value={stats.total_contacts}
                    color="#3ECF8E"
                  />
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="bg-[#10141F] border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-white/50 text-left">
                        <th className="px-5 py-3 font-medium">Username</th>
                        <th className="px-5 py-3 font-medium">Email</th>
                        <th className="px-5 py-3 font-medium">Role</th>
                        <th className="px-5 py-3 font-medium">Submissions</th>
                        <th className="px-5 py-3 font-medium">Joined</th>
                        <th className="px-5 py-3 font-medium text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr
                          key={u.id}
                          className="border-t border-white/5 hover:bg-white/2"
                        >
                          <td className="px-5 py-3">{u.username}</td>
                          <td className="px-5 py-3 text-white/60">{u.email}</td>
                          <td className="px-5 py-3">
                            {u.is_superuser ? (
                              <span className="text-xs bg-[#3ECF8E]/10 text-[#3ECF8E] px-2 py-1 rounded-full">
                                Superuser
                              </span>
                            ) : u.is_staff ? (
                              <span className="text-xs bg-[#3ECF8E]/10 text-[#3ECF8E] px-2 py-1 rounded-full">
                                Admin
                              </span>
                            ) : (
                              <span className="text-xs bg-white/10 text-white/50 px-2 py-1 rounded-full">
                                User
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">{u.submission_count}</td>
                          <td className="px-5 py-3 text-white/40">
                            {new Date(u.date_joined).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {!u.is_superuser && (
                              <button
                                onClick={() =>
                                  handleDeleteUser(u.id, u.username)
                                }
                                className="text-[#E8935B] hover:underline text-xs font-medium"
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-8 text-center text-white/30"
                          >
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SUBMISSIONS TAB */}
              {activeTab === "submissions" && (
                <div className="bg-[#10141F] border border-white/10 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/5 text-white/50 text-left">
                        <th className="px-5 py-3 font-medium">User</th>
                        <th className="px-5 py-3 font-medium">Text Preview</th>
                        <th className="px-5 py-3 font-medium">Result</th>
                        <th className="px-5 py-3 font-medium">Confidence</th>
                        <th className="px-5 py-3 font-medium">Date</th>
                        <th className="px-5 py-3 font-medium text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((s) => (
                        <tr
                          key={s.id}
                          className="border-t border-white/5 hover:bg-white/2"
                        >
                          <td className="px-5 py-3">{s.username}</td>
                          <td className="px-5 py-3 text-white/60 max-w-xs truncate">
                            {s.text_preview}
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                s.prediction === "FAKE"
                                  ? "bg-[#E8935B]/10 text-[#E8935B]"
                                  : "bg-[#3ECF8E]/10 text-[#3ECF8E]"
                              }`}
                            >
                              {s.prediction}
                            </span>
                          </td>
                          <td className="px-5 py-3">{s.confidence}%</td>
                          <td className="px-5 py-3 text-white/40">
                            {new Date(s.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => handleDeleteSubmission(s.id)}
                              className="text-[#E8935B] hover:underline text-xs font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {filteredSubmissions.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-5 py-8 text-center text-white/30"
                          >
                            No submissions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RETRAIN TAB */}
              {activeTab === "retrain" && (
                <div className="bg-[#10141F] border border-white/10 rounded-xl p-8 max-w-xl">
                  <h3 className="font-semibold mb-2">Retrain ML Model</h3>
                  <p className="text-sm text-white/50 mb-6">
                    This triggers the model retraining pipeline using the latest
                    dataset. Depending on data size, this may take some time.
                  </p>
                  <button
                    onClick={handleRetrain}
                    disabled={retraining}
                    className="bg-[#3ECF8E] text-[#0B0E14] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#3ECF8E]/90 transition-colors disabled:opacity-50"
                  >
                    {retraining ? "Retraining..." : "Start Retrain"}
                  </button>
                  {retrainMessage && (
                    <p className="mt-4 text-sm text-white/60 bg-white/5 rounded-lg p-3">
                      {retrainMessage}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-[#10141F] border border-white/10 rounded-xl p-5">
      <p className="text-xs text-white/40 mb-2">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
