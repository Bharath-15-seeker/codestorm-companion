import { useEffect, useMemo, useState } from "react";
import { Trophy } from "lucide-react";

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

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8081/api/leaderboard/${tab.toLowerCase()}`)
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
         {/* Top 3 (1st in center) */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end">
  {/* 2nd Place */}
  {top3[1] && (
    <div className="order-1 sm:order-1">
      <div className="p-4 rounded-xl border bg-card text-center
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
        <div className="text-2xl mb-1">🥈</div>
        <p className="font-semibold text-foreground">
          {top3[1].studentName}
        </p>
        <p className="text-xs text-muted-foreground">
          {top3[1].studentEmail}
        </p>
        <p className="mt-2 font-bold text-foreground">
          {top3[1].totalPoints} pts
        </p>
      </div>
    </div>
  )}

  {/* 1st Place (CENTER) */}
  {top3[0] && (
    <div className="order-2 sm:order-2">
      <div className="p-6 rounded-2xl border bg-card text-center
        transition-all duration-300 ease-out
        hover:-translate-y-3 hover:shadow-xl hover:scale-[1.05]">
        <div className="text-3xl mb-2">🥇</div>
        <p className="text-lg font-bold text-foreground">
          {top3[0].studentName}
        </p>
        <p className="text-xs text-muted-foreground">
          {top3[0].studentEmail}
        </p>
        <p className="mt-3 text-xl font-extrabold text-foreground">
          {top3[0].totalPoints} pts
        </p>
      </div>
    </div>
  )}

  {/* 3rd Place */}
  {top3[2] && (
    <div className="order-3 sm:order-3">
      <div className="p-4 rounded-xl border bg-card text-center
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-lg hover:scale-[1.02]">
        <div className="text-2xl mb-1">🥉</div>
        <p className="font-semibold text-foreground">
          {top3[2].studentName}
        </p>
        <p className="text-xs text-muted-foreground">
          {top3[2].studentEmail}
        </p>
        <p className="mt-2 font-bold text-foreground">
          {top3[2].totalPoints} pts
        </p>
      </div>
    </div>
  )}
</div>


          {/* Rest of leaderboard */}
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
                    className="border-b last:border-0 hover:bg-muted/50"
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
