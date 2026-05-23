export type CaseFilterTab = 'All' | 'Pending' | 'Finalized';

const TABS: CaseFilterTab[] = ['All', 'Pending', 'Finalized'];

interface Props {
    activeTab: CaseFilterTab;
    onChange: (tab: CaseFilterTab) => void;
    counts: Record<CaseFilterTab, number>;
}

export default function CaseFilterTabs({ activeTab, onChange, counts }: Props) {
    return (
        <div className="cl__filter-tabs">
            {TABS.map(tab => (
                <button
                    key={tab}
                    className={`cl__filter-tab ${activeTab === tab ? 'cl__filter-tab--active' : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab === 'All' ? 'All Cases' : tab}
                    {counts[tab] > 0 && (
                        <span className="cl__tab-badge">{counts[tab]}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
