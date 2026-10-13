
import { useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Download,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Search,
  ShieldCheck,
  Users,
  Clock3,
  X,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Participants", icon: Users },
  { label: "Usage Analytics", icon: BarChart3 },
];

const sampleParticipants = [
  { code: "P001", sessions: 2, duration: "00:59", status: "Active" },
  { code: "P002", sessions: 0, duration: "00:00", status: "No sessions" },
  { code: "P003", sessions: 0, duration: "00:00", status: "No sessions" },
  { code: "P004", sessions: 0, duration: "00:00", status: "No sessions" },
];

function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredParticipants = sampleParticipants.filter((participant) =>
    participant.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fe] text-slate-800">
      {sidebarOpen && (
        <button
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-blue-100 bg-white px-5 py-6 shadow-xl transition-transform duration-200 lg:w-64 lg:translate-x-0 lg:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-soft">
              <FlaskConical size={22} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Shione
              </h1>
              <p className="text-xs text-slate-500">Research Portal</p>
            </div>
          </div>

          <button
            aria-label="Close sidebar"
            aria-controls="dashboard-sidebar"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-300 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-8 sm:mt-10">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1" aria-label="Main navigation">
            {navigation.map(({ label, icon: Icon }) => {
              const selected = activePage === label;

              return (
                <button
                  key={label}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => {
                    setActivePage(label);
                    setSidebarOpen(false);
                  }}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                    selected
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <Icon size={19} />
                  <span>{label}</span>
                  {selected && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm">
            <ShieldCheck size={19} />
          </div>
          <p className="text-sm font-semibold text-slate-800">
            Research workspace
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Authorized access to aggregated usage data.
          </p>
        </div>

        <p className="mt-5 px-1 text-xs text-slate-400">
          Shione Research · v1.0
        </p>
      </aside>

      <div className="min-h-screen min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 flex min-h-[68px] items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-3 py-3 backdrop-blur-xl sm:min-h-[76px] sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              aria-label="Open navigation menu"
              aria-controls="dashboard-sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
              className="shrink-0 rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-slate-400 sm:text-xs">
                Shione / Research
              </p>
              <h2 className="mt-0.5 truncate text-sm font-bold text-slate-900 sm:text-base">
                {activePage}
              </h2>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-700">
                Research portal
              </span>
            </div>

            <div
              aria-label="Research account"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 sm:h-10 sm:w-10"
            >
              R
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] min-w-0 px-3 py-5 sm:px-7 sm:py-8 lg:px-10 lg:py-9">
          <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-end sm:gap-5">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold tracking-wide text-blue-600 sm:text-sm">
                RESEARCH OVERVIEW
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Usage at a glance
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Review participant engagement and recorded app usage across
                your research period.
              </p>
            </div>

            <button
              onClick={() =>
                window.alert("CSV export will be added in a later step.")
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 sm:w-auto"
            >
              <Download size={17} />
              Export report
            </button>
          </div>

          <section
            aria-label="Research period filters"
            className="mb-6 flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <CalendarDays size={18} className="shrink-0 text-blue-600" />
              Research period
            </div>

            <div className="grid w-full min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] lg:w-auto">
              <input
                aria-label="Start date"
                type="date"
                defaultValue="2026-10-01"
                className="min-h-11 w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <span className="hidden items-center justify-center text-sm text-slate-400 sm:flex">
                to
              </span>

              <input
                aria-label="End date"
                type="date"
                defaultValue="2026-10-13"
                className="min-h-11 w-full min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              />

              <button className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">
                Apply
              </button>
            </div>
          </section>

          <section
            aria-label="Usage summary"
            className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
          >
            {[
              {
                label: "Total participants",
                value: "6",
                note: "Registered USER accounts",
                icon: Users,
                color: "blue",
              },
              {
                label: "Recorded sessions",
                value: "4",
                note: "Sample display only",
                icon: Activity,
                color: "violet",
              },
              {
                label: "Recorded usage",
                value: "1m 38s",
                note: "Sample display only",
                icon: Clock3,
                color: "cyan",
              },
              {
                label: "Average session",
                value: "29s",
                note: "Sample display only",
                icon: BarChart3,
                color: "indigo",
              },
            ].map(({ label, value, note, icon: Icon, color }) => (
              <div
                key={label}
                className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft transition hover:shadow-md sm:p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-500">
                    {label}
                  </p>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      color === "blue"
                        ? "bg-blue-50 text-blue-600"
                        : color === "violet"
                          ? "bg-violet-50 text-violet-600"
                          : color === "cyan"
                            ? "bg-cyan-50 text-cyan-700"
                            : "bg-indigo-50 text-indigo-600"
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                <p className="mt-4 break-words text-3xl font-bold tracking-tight text-slate-900 sm:mt-5">
                  {value}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {note}
                </p>
              </div>
            ))}
          </section>

          <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,1fr)]">
            <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Daily usage activity
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Recorded usage by day
                  </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  Seconds
                </span>
              </div>

              <div className="mt-7 flex h-48 items-end gap-1.5 border-b border-l border-slate-100 px-2 pt-5 sm:h-56 sm:gap-5 sm:px-3">
                {[32, 52, 38, 72, 45, 88, 58, 66, 40, 76, 54, 95].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="group relative flex h-full min-w-0 flex-1 items-end"
                      title={`Sample day ${index + 1}: ${height} seconds`}
                    >
                      <div
                        style={{ height: `${height}%` }}
                        className={`w-full rounded-t-md transition ${
                          index === 11
                            ? "bg-blue-600"
                            : "bg-blue-200 group-hover:bg-blue-400"
                        }`}
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-3 flex justify-between gap-1 text-[10px] text-slate-400 sm:text-[11px]">
                <span>Oct 1</span>
                <span>Oct 4</span>
                <span>Oct 7</span>
                <span className="hidden sm:inline">Oct 10</span>
                <span>Oct 13</span>
              </div>

              <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800">
                Preview chart — replace sample bars with API analytics in the
                next step.
              </p>
            </section>

            <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6">
              <h3 className="font-bold text-slate-900">Research notes</h3>
              <p className="mt-1 text-sm text-slate-500">
                Important interpretation reminders
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Users size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Pseudonymous participants
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Use research codes in reports instead of names or email
                      addresses.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Clock3 size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Recorded time
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Usage duration is an estimate from app session tracking,
                      not proof of active interaction.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-xs leading-5 text-slate-500">
                  Research data should be interpreted within the study's
                  methodology and privacy procedures.
                </p>
              </div>
            </section>
          </div>

          <section className="mt-6 min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
            <div className="flex min-w-0 flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900">Participants</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Pseudonymous usage summaries
                </p>
              </div>

              <div className="relative w-full min-w-0 sm:w-64 sm:shrink-0">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search research code..."
                  aria-label="Search participants by research code"
                  className="min-h-11 w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="w-full max-w-full overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-4 font-semibold sm:px-6">
                      Research code
                    </th>
                    <th className="px-4 py-4 font-semibold sm:px-6">
                      Sessions
                    </th>
                    <th className="px-4 py-4 font-semibold sm:px-6">
                      Recorded time
                    </th>
                    <th className="px-4 py-4 font-semibold sm:px-6">
                      Status
                    </th>
                    <th className="px-4 py-4 text-right font-semibold sm:px-6">
                      Details
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredParticipants.map((participant) => (
                    <tr
                      key={participant.code}
                      className="transition hover:bg-blue-50/30"
                    >
                      <td className="px-4 py-4 sm:px-6">
                        <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-blue-700">
                          {participant.code}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-700 sm:px-6">
                        {participant.sessions}
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">
                        {participant.duration}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                            participant.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {participant.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-slate-400 sm:px-6">
                        <ChevronDown size={17} className="ml-auto" />
                      </td>
                    </tr>
                  ))}

                  {filteredParticipants.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-sm text-slate-500"
                      >
                        No matching research codes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-4 py-4 text-xs leading-5 text-slate-400 sm:px-6">
              Preview data only. Live participant data will be connected next.
              <span className="mt-1 block sm:mt-0 sm:inline">
                {" "}On phones, swipe sideways to view all columns.
              </span>
            </div>
          </section>

          <footer className="py-7 text-center text-xs leading-5 text-slate-400">
            Shione Research Portal · Designed for responsible research
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
