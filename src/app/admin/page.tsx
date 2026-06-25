"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Log = {
  id: string;
  message: string;
  eventType: string;
  createdAt: string;

  refund?: {
    status?: string;

    order?: {
      orderNumber?: string;
    };
  };
};

type Stats = {
  total: number;
  approved: number;
  rejected: number;
  review: number;
};

const cardStyle = `
rounded-3xl
border
border-white/10
bg-white/5
backdrop-blur-2xl
shadow-[0_0_40px_rgba(59,130,246,.08)]
p-8
transition-all
duration-300
hover:-translate-y-2
hover:scale-[1.01]
`;

export default function AdminPage() {
  const [logs, setLogs] =
    useState<Log[]>([]);

  const [stats, setStats] =
    useState<Stats>({
      total: 0,
      approved: 0,
      rejected: 0,
      review: 0,
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [
          logsRes,
          statsRes,
        ] = await Promise.all([
          fetch("/api/logs"),
          fetch("/api/dashboard/stats"),
        ]);

        const logsData =
          await logsRes.json();

        const statsData =
          await statsRes.json();

        setLogs(logsData);

        setStats(statsData);

      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main
      className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-indigo-950
to-black
text-white
"
    >

      <div
        className="
mx-auto
max-w-[1600px]
px-8
py-10
space-y-10
"
      >

        {/* HEADER */}

        <div>

          <h1
            className="
text-6xl
font-black
bg-gradient-to-r
from-cyan-400
to-blue-500
bg-clip-text
text-transparent
"
          >
            Agent Dashboard
          </h1>

          <p className="mt-2 text-xl text-slate-300">
            Monitor refund decisions and AI activity
          </p>

        </div>

        {/* STATS */}

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          <Card className={cardStyle}>
            <h3 className="text-slate-400">
              Total Requests
            </h3>

            <p className="mt-4 text-5xl font-black">
              {stats.total}
            </p>
          </Card>

          <Card className={cardStyle}>
            <h3 className="text-slate-400">
              Approved
            </h3>

            <p className="mt-4 text-5xl font-black text-green-400">
              {stats.approved}
            </p>
          </Card>

          <Card className={cardStyle}>
            <h3 className="text-slate-400">
              Rejected
            </h3>

            <p className="mt-4 text-5xl font-black text-red-400">
              {stats.rejected}
            </p>
          </Card>

          <Card className={cardStyle}>
            <h3 className="text-slate-400">
              Manager Review
            </h3>

            <p className="mt-4 text-5xl font-black text-yellow-400">
              {stats.review}
            </p>
          </Card>

        </div>

        {/* DASHBOARD */}

        <div className="grid gap-8 lg:grid-cols-2">

          {/* Latest Decision */}

          <Card className={cardStyle}>

            <h2 className="mb-6 text-2xl font-black">
              Latest Decision
            </h2>

            <Badge
              className="
bg-gradient-to-r
from-blue-500
to-cyan-500
text-white
border-none
px-4
py-1
"
            >
              {
                logs[0]
                  ?.refund
                  ?.status ||
                "Waiting"
              }
            </Badge>

            <p className="mt-6 text-lg text-slate-300">
              {
                logs[0]
                  ?.message ||
                "No decisions yet"
              }
            </p>

          </Card>

          {/* Tool Execution */}

          <Card className={cardStyle}>

            <h2 className="mb-6 text-2xl font-black">
              Tool Execution
            </h2>

            <ul className="space-y-4 text-slate-300">

              <li>✓ Customer Request</li>

              <li>✓ Order Lookup</li>

              <li>✓ Policy Evaluation</li>

              <li>✓ AI Explanation</li>

              <li>✓ Database Logging</li>

            </ul>

          </Card>

          {/* Timeline */}

          <Card className={cardStyle}>

            <h2 className="mb-6 text-2xl font-black">
              Reasoning Timeline
            </h2>

            <ul className="space-y-4">

              {logs
                .slice(0, 5)
                .map(
                  (
                    log
                  ) => (

                    <li
                      key={
                        log.id
                      }
                      className="text-slate-300"
                    >

                      • {log.eventType}

                    </li>
                  )
                )}

            </ul>

          </Card>

          {/* Recent Logs */}

          <Card
className={`
${cardStyle}
max-h-[600px]
overflow-hidden
`}
>

            <h2 className="mb-6 text-2xl font-black">
              Recent Logs
            </h2>

            {loading ? (

              <p className="text-slate-400">
                Loading...
              </p>

            ) : (

              <ul
className="
space-y-4
max-h-[420px]
overflow-y-auto
pr-2
"
>

                {logs.map(
                  (
                    log
                  ) => (

                    <li
                      key={
                        log.id
                      }
                      className="
border-b
border-white/10
pb-4
"
                    >

                      <div className="font-medium">

                        {
                          log.message
                        }

                      </div>

                      <div
                        className="
mt-2
text-sm
text-slate-400
"
                      >

                        {
                          log
                            .refund
                            ?.order
                            ?.orderNumber
                        }

                        {" • "}

                        {new Date(
                          log.createdAt
                        ).toLocaleString()}

                      </div>

                    </li>
                  )
                )}

              </ul>

            )}

          </Card>

        </div>

      </div>

    </main>
  );
}