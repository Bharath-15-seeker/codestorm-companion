import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type LeaderboardEntry = {
  studentId: number;
  studentName: string;
  studentEmail: string;
  totalPoints: number;
};

type TabType = "CODING" | "APTITUDE";

const Leaderboard = () => {
  const [tab, setTab] = useState<TabType>("CODING");
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`https://demo-deployment-latest-dfxy.onrender.com/api/leaderboard/${tab.toLowerCase()}`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tab]);

  const sorted = useMemo(
    () => [...data].sort((a, b) => b.totalPoints - a.totalPoints),
    [data]
  );

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you rank among other students
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["CODING", "APTITUDE"] as TabType[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading leaderboard...</p>
      ) : (
        <>
          {/* Top 3 */}
        {/* ================= TOP 3 ================= */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">

{/* 2nd Place */}
{top3[1] && (
  <div
    onClick={() => navigate(`/dashboard/profile/${top3[1].studentId}`)}
    className="order-1 sm:order-1 cursor-pointer"
  >
    <div className="p-5 rounded-xl border bg-card text-center
      transition-all duration-300 ease-out
      hover:-translate-y-3 hover:shadow-xl hover:scale-[1.04]">

      <div className="text-3xl mb-2">🥈</div>

      <p className="font-semibold text-foreground">
        {top3[1].studentName}
      </p>

      <p className="text-xs text-muted-foreground">
        {top3[1].studentEmail}
      </p>

      <p className="mt-3 font-bold text-foreground">
        {top3[1].totalPoints} pts
      </p>
    </div>
  </div>
)}

{/* 🥇 FIRST PLACE (CENTER & BIGGER) */}
{top3[0] && (
  <div
    onClick={() => navigate(`/dashboard/profile/${top3[0].studentId}`)}
    className="order-2 sm:order-2 cursor-pointer"
  >
    <div className="p-8 rounded-2xl border bg-card text-center
      transition-all duration-300 ease-out
      hover:-translate-y-4 hover:shadow-2xl hover:scale-[1.08]
      ring-2 ring-primary/20">

      <div className="text-4xl mb-3">🥇</div>

      <p className="text-xl font-bold text-foreground">
        {top3[0].studentName}
      </p>

      <p className="text-xs text-muted-foreground">
        {top3[0].studentEmail}
      </p>

      <p className="mt-4 text-2xl font-extrabold text-primary">
        {top3[0].totalPoints} pts
      </p>
    </div>
  </div>
)}

{/* 3rd Place */}
{top3[2] && (
  <div
    onClick={() => navigate(`/dashboard/profile/${top3[2].studentId}`)}
    className="order-3 sm:order-3 cursor-pointer"
  >
    <div className="p-5 rounded-xl border bg-card text-center
      transition-all duration-300 ease-out
      hover:-translate-y-3 hover:shadow-xl hover:scale-[1.04]">

      <div className="text-3xl mb-2">🥉</div>

      <p className="font-semibold text-foreground">
        {top3[2].studentName}
      </p>

      <p className="text-xs text-muted-foreground">
        {top3[2].studentEmail}
      </p>

      <p className="mt-3 font-bold text-foreground">
        {top3[2].totalPoints} pts
      </p>
    </div>
  </div>
)}

</div>


          {/* Rest */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="py-2 px-2">Rank</th>
                  <th className="py-2 px-2">Student</th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2 text-right">Points</th>
                </tr>
              </thead>
              <tbody>
                {rest.map((user, index) => (
                  <tr
                    key={user.studentId}
                    onClick={() =>
                      navigate(`/dashboard/profile/${user.studentId}`)
                    }
                    className="cursor-pointer border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-2 px-2 font-medium">
                      {index + 4}
                    </td>
                    <td className="py-2 px-2">
                      {user.studentName}
                    </td>
                    <td className="py-2 px-2 text-muted-foreground text-sm">
                      {user.studentEmail}
                    </td>
                    <td className="py-2 px-2 text-right font-semibold">
                      {user.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
