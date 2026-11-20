const options = [{ value:'all', label:'All time' }, { value:'week', label:'7 days' }, { value:'month', label:'This month' }, { value:'year', label:'This year' }];
export default function PeriodTabs({ value, onChange }) {
  return <div className="period-tabs">{options.map(o => <button key={o.value} onClick={() => onChange(o.value)} className={value===o.value?'selected':''}>{o.label}</button>)}</div>;
}
