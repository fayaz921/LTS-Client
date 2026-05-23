import type { ChangeEvent } from 'react';

interface FollowUpPageHeaderProps {
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  onAdd: () => void;
}

export const FollowUpPageHeader = ({
  totalCount,
  search,
  onSearchChange,
  onAdd,
}: FollowUpPageHeaderProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>📅</span>
          <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#1B2A4A' }}>Follow-Ups</h1>
        </div>
        <p style={{ margin: '4px 0 0 32px', fontSize: '13px', color: '#64748B' }}>
          Total Records: <strong>{totalCount}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#A0ABBE' }}>🔍</span>
          <input
            type="text"
            className="fu-srch"
            placeholder="Search details..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            style={{
              padding: '10px 16px 10px 36px',
              borderRadius: '10px',
              border: '1px solid #EEE9DC',
              fontSize: '13px',
              width: '220px',
              outline: 'none',
              transition: 'all 0.2s',
              background: '#fff',
            }}
          />
        </div>

        <button
          onClick={onAdd}
          className="fu-add"
          style={{
            background: '#D4A843',
            color: '#1B2A4A',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(212,168,67,0.25)',
          }}
        >
          + Add FollowUp
        </button>
      </div>
    </div>
  );
};