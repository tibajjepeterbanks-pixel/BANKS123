'use client';

export function Stats() {
  const stats = [
    { icon: '📚', label: 'Past Papers', value: '10,480' },
    { icon: '🎓', label: 'Universities', value: '20' },
    { icon: '👥', label: 'Active Students', value: '52,340' },
    { icon: '⬇️', label: 'Total Downloads', value: '1.2M' },
  ];

  return (
    <section className="py-12 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow text-center"
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gradient">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
