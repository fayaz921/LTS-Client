export type CaseFilterTab = 'All' | 'Pending' | 'Finalized';

const TABS: CaseFilterTab[] = ['All', 'Pending', 'Finalized'];

interface Props {
    activeTab: CaseFilterTab;
    onChange: (tab: CaseFilterTab) => void;
}

export default function CaseFilterTabs({ activeTab, onChange }: Props) {
    return (
        <div className="cl__filter-tabs">
            {TABS.map(tab => (
                <button
                    key={tab}
                    className={`cl__filter-tab ${activeTab === tab ? 'cl__filter-tab--active' : ''}`}
                    onClick={() => onChange(tab)}
                >
                    {tab === 'All' ? 'All Cases' : tab}
                </button>
            ))}
        </div>
    );
}
