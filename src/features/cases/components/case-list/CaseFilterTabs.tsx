export type CaseFilterTab = 'All' | 'Pending' | 'Finalized';

interface TabConfig {
    key: CaseFilterTab;
    label: string;
    colorClass: string;
    icon: string;
}

const TABS: TabConfig[] = [
    { key: 'All', label: 'All Cases', colorClass: 'cl__filter-tab--all', icon: 'bi-stack' },
    { key: 'Pending', label: 'Pending', colorClass: 'cl__filter-tab--pending', icon: 'bi-clock' },
    { key: 'Finalized', label: 'Finalized', colorClass: 'cl__filter-tab--finalized', icon: 'bi-check-circle' },
];

interface Props {
    activeTab: CaseFilterTab;
    onChange: (tab: CaseFilterTab) => void;
    counts: Record<CaseFilterTab, number>;
}

export default function CaseFilterTabs({ activeTab, onChange, counts }: Props) {
    return (
        <div className="cl__filter-tabs">
            {TABS.map(({ key, label, colorClass, icon }) => (
                <button
                    key={key}
                    className={`cl__filter-tab ${colorClass} ${activeTab === key ? 'cl__filter-tab--active' : ''}`}
                    onClick={() => onChange(key)}
                >
                    <i className={`bi ${icon} cl__tab-icon`} />
                    {label}
                    {counts[key] > 0 && (
                        <span className="cl__tab-badge">{counts[key]}</span>
                    )}
                </button>
            ))}
        </div>
    );
}