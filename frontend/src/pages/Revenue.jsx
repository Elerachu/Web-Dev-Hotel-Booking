import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { reportsApi } from '../api/reports.js';
import { useApiData } from '../hooks/useApiData.js';
import Button from '../components/ui/Button.jsx';
import FilterTabs from '../components/ui/FilterTabs.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import { formatMoney, formatMoneyShort } from '../utils/format.js';

// Three shades of the secondary colour: darkest = money already earned, lightest = not yet earned
const SERIES = [
  { key: 'earned', label: 'Earned', hint: 'Checked out', color: '#114645' },
  { key: 'in_house', label: 'In house', hint: 'Checked in', color: '#22857f' },
  { key: 'expected', label: 'Expected', hint: 'Pending', color: '#a8d9d5' }
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const month = payload[0].payload;
  const total = month.earned + month.in_house + month.expected;
  return (
    <div className="min-w-52 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-ink">{label}</p>
      {SERIES.map((series) => (
        <p key={series.key} className="flex items-center justify-between gap-6 py-0.5 text-slate-600">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: series.color }} />
            {series.label}
          </span>
          <span className="tabular text-ink">{formatMoney(month[series.key])}</span>
        </p>
      ))}
      <p className="mt-2 flex justify-between border-t border-slate-100 pt-2 font-semibold text-ink">
        <span>Total</span>
        <span className="tabular">{formatMoney(total)}</span>
      </p>
      <p className="mt-1 text-xs text-slate-400">
        {month.bookings} {month.bookings === 1 ? 'booking' : 'bookings'}
      </p>
    </div>
  );
}

export default function Revenue() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data, loading, error, reload } = useApiData(() => reportsApi.revenue(year), [year]);

  if (error) {
    return (
      <div className="rounded-xl border border-slate-200 px-6 py-14 text-center">
        <p className="text-red-600">{error.message}</p>
        <Button variant="ghost" className="mt-3" onClick={reload}>
          Try again
        </Button>
      </div>
    );
  }

  const totals = data?.totals;
  const show = (value) => (loading || !totals ? '–' : formatMoney(value));
  const chartData = (data?.monthly || []).map((m, index) => ({ ...m, label: MONTHS[index] }));
  const years = data?.years || [year];
  const topRoomRevenue = Math.max(...(data?.by_room_type || []).map((r) => r.revenue), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <FilterTabs
          label="Choose a year"
          tabs={years.map((y) => ({ value: y, label: String(y) }))}
          value={year}
          onChange={setYear}
        />
        <p className="text-[15px] text-slate-500">By check-in month. Cancelled bookings are not counted.</p>
      </div>

      <section aria-label="Revenue totals" className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={show(totals?.total)} footnote={totals ? `${totals.bookings} ${totals.bookings === 1 ? 'booking' : 'bookings'} in ${year}` : undefined} />
        <StatCard label="Earned" value={show(totals?.earned)} footnote="Guests who have checked out" />
        <StatCard label="In house" value={show(totals?.in_house)} footnote="Guests staying now" />
        <StatCard label="Expected" value={show(totals?.expected)} footnote="Pending bookings" />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-medium tracking-tight text-ink">Revenue per month</h2>
          <ul className="flex flex-wrap gap-5 text-sm text-slate-600">
            {SERIES.map((series) => (
              <li key={series.key} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: series.color }} />
                {series.label}
                <span className="text-slate-400">({series.hint.toLowerCase()})</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-80">
          {loading ? (
            <p className="flex h-full items-center justify-center text-slate-400">Loading…</p>
          ) : (
            // A fixed pixel height (not "100%") plus a starting size means the chart can draw
            // even if the browser hasn't finished measuring the page yet.
            <ResponsiveContainer width="100%" height={320} initialDimension={{ width: 800, height: 320 }}>
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="28%">
                <CartesianGrid vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13 }} />
                <YAxis
                  tickFormatter={formatMoneyShort}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tick={{ fill: '#64748b', fontSize: 13 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: '#edf7f6' }} />
                {SERIES.map((series, index) => (
                  <Bar
                    key={series.key}
                    dataKey={series.key}
                    name={series.label}
                    stackId="revenue"
                    fill={series.color}
                    radius={index === SERIES.length - 1 ? [6, 6, 0, 0] : 0}
                    isAnimationActive={false}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <h2 className="mb-5 text-xl font-medium tracking-tight text-ink">Revenue by room type</h2>
          {!loading && data.by_room_type.length === 0 && (
            <p className="text-slate-500">No bookings with a check-in date in {year}.</p>
          )}
          <ul className="space-y-4">
            {(data?.by_room_type || []).map((row) => (
              <li key={row.room_type}>
                <div className="mb-1.5 flex items-baseline justify-between gap-4 text-[15px]">
                  <span className="text-ink">{row.room_type}</span>
                  <span className="tabular text-slate-500">
                    <span className="font-medium text-ink">{formatMoney(row.revenue)}</span>
                    {'  '}from {row.bookings} {row.bookings === 1 ? 'booking' : 'bookings'}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-lagoon-50">
                  <div
                    className="h-full rounded-full bg-lagoon-500"
                    style={{ width: `${topRoomRevenue ? (row.revenue / topRoomRevenue) * 100 : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-medium tracking-tight text-ink">Lost to cancellations</h2>
          <p className="tabular mt-3 text-4xl font-semibold tracking-tight text-ink">{show(totals?.cancelled)}</p>
          <p className="mt-2 text-[15px] text-slate-500">
            Value of bookings cancelled in {year}. Not included in the totals above.
          </p>
        </section>
      </div>
    </div>
  );
}
