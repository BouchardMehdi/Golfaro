const foundations = [
  "Next.js et TypeScript",
  "FastAPI et SQLAlchemy",
  "PostgreSQL isolé",
  "Docker Compose",
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-4xl rounded-3xl border border-emerald-900/10 bg-white p-8 shadow-xl shadow-emerald-950/5 sm:p-12">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-700 text-lg font-bold text-white">
            G
          </span>
          <div>
            <p className="text-xl font-semibold tracking-tight text-slate-950">
              Golfaro
            </p>
            <p className="text-sm text-slate-500">Fondations du projet</p>
          </div>
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
          En construction
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
          Le socle technique est prêt pour les premiers modules métier.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          Golfaro deviendra une plateforme tout-en-un pour piloter les opérations
          quotidiennes d&apos;un club de golf.
        </p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {foundations.map((foundation) => (
            <li
              key={foundation}
              className="flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-950"
            >
              <span className="size-2 rounded-full bg-emerald-600" />
              {foundation}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

