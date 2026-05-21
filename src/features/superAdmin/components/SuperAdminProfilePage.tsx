import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADD THIS
import { useAuthStore } from '../../../store/authStore';
import { useGetProfile, useUpdateProfile, useUpdateProfilePicture } from '../../UserProfile/hooks/useProfile';
import type { UpdateProfileCommand } from '../../UserProfile/types/profile.types';
import { SuperAdminLayout } from '../../../shared/components/SuperAdminLayout';
import { useDashboardStats } from '../hooks/useSuperAdmin';

type SidebarSection = 'overview' | 'organizations' | 'trials' | 'subscriptions' | 'payments' | 'revenue';

export const SuperAdminProfilePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate(); // ✅ ADD THIS
  const { data: stats } = useDashboardStats();
  const { data: profileData, isLoading: profileLoading } = useGetProfile();
  const { mutate: saveProfile, isPending } = useUpdateProfile();
  const { mutate: uploadPicture, isPending: isUploading } = useUpdateProfilePicture();

  const profile = profileData?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditingState] = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [formData, setFormData] = useState<UpdateProfileCommand>({
    name: '',
    phone: '',
    location: '',
  });

  const setIsEditing = (val: boolean) => {
    isEditingRef.current = val;
    setIsEditingState(val);
  };

  // ✅ KEY FIX — sidebar click hone par dashboard pe navigate karo
  const handleSectionChange = (section: SidebarSection) => {
    setActiveSection(section);
    navigate('/super-admin');
  };

  useEffect(() => {
    if (profile && !isEditingRef.current) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        location: profile.location || '',
      });
    }
  }, [profile]);

  const initials = user?.name
    ?.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || 'SA';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    uploadPicture(file);
  };

  const handleSave = () => {
    saveProfile(formData, { onSuccess: () => setIsEditing(false) });
  };

  const avatarSrc = previewUrl || profile?.profilePictureUrl || user?.profileImage || null;

  return (
    <SuperAdminLayout
      activeSection={activeSection}
      onSectionChange={handleSectionChange} // ✅ CHANGED — ab navigate karega
      stats={{
        totalOrganizations: stats?.totalOrganizations ?? 0,
        totalActiveUsers:   stats?.totalActiveUsers   ?? 0,
        activeTrials:       stats?.activeTrials       ?? 0,
        totalRevenue:       stats?.totalRevenue       ?? 0,
      }}
    >
      <div className="container-fluid py-2">

        {/* HERO */}
        <div className="rounded-3 p-4 mb-4 text-white"
          style={{ background: 'linear-gradient(135deg, #0f1c2e 0%, #1a2d45 100%)' }}>
          <div className="small fw-bold text-uppercase mb-3"
            style={{ color: '#c89b2a', letterSpacing: '0.1em' }}>
            Super Admin Profile
          </div>
          <div className="d-flex align-items-center gap-4 flex-wrap">

            {/* Avatar */}
            <div className="position-relative flex-shrink-0"
              style={{ cursor: 'pointer' }}
              onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef} type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handleFileChange}
              />
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar" className="rounded-circle"
                  style={{ width: 84, height: 84, objectFit: 'cover',
                    border: '3px solid rgba(200,155,42,0.4)',
                    opacity: isUploading ? 0.6 : 1 }} />
              ) : (
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: 84, height: 84,
                    background: 'linear-gradient(135deg, #c89b2a, #e8b84b)',
                    fontSize: '1.7rem', color: '#1e2d45',
                    border: '3px solid rgba(200,155,42,0.4)' }}>
                  {initials}
                </div>
              )}
              <div className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: 26, height: 26, background: '#c89b2a',
                  border: '2px solid #0f1c2e', fontSize: '0.7rem' }}>
                {isUploading ? '⏳' : '📷'}
              </div>
            </div>

            {/* Info */}
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
                {user?.name || 'Super Admin'}
              </h1>
              <span className="badge mb-2 px-3 py-1"
                style={{ background: 'linear-gradient(90deg,#c89b2a,#e8b84b)',
                  color: '#1e2d45', fontSize: '0.72rem', fontWeight: 700 }}>
                ⚡ Super Admin
              </span>
              <div className="small" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {user?.email}
              </div>
            </div>

            {/* Edit Button */}
            <div className="ms-auto">
              <button className="btn btn-sm fw-bold px-4"
                style={{ background: '#c89b2a', color: '#1e2d45', borderRadius: 8 }}
                onClick={() => setIsEditing(!isEditingRef.current)}>
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total Organizations', value: stats?.totalOrganizations ?? 0, sub: 'All registered',        color: '#3b5bdb' },
            { label: 'Active Trials',        value: stats?.activeTrials       ?? 0, sub: 'Currently on trial',   color: '#c89b2a' },
            { label: 'Paid Subscriptions',   value: stats?.paidSubscriptions  ?? 0, sub: 'Active plans',         color: '#2f9e44' },
            { label: 'Total Revenue', value: `PKR ${(stats?.totalRevenue ?? 0).toLocaleString()}`, sub: 'Collected so far', color: '#e53e3e' },
          ].map((stat, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="small fw-bold text-uppercase text-muted"
                      style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
                      {stat.label}
                    </span>
                    <div className="rounded-circle" style={{ width: 9, height: 9, background: stat.color }} />
                  </div>
                  <div className="fw-bold" style={{ fontSize: '1.8rem', lineHeight: 1 }}>{stat.value}</div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{stat.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="row g-4">

          {/* Personal Info */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span className="rounded-circle d-inline-block"
                      style={{ width: 8, height: 8, background: '#c89b2a' }} />
                    Personal Information
                  </h6>
                  <button className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                    style={{ color: '#c89b2a' }}
                    onClick={() => setIsEditing(!isEditingRef.current)}>
                    ✏️ Edit
                  </button>
                </div>

                {profileLoading ? (
                  <div className="text-center py-4 text-muted" style={{ fontSize: '0.85rem' }}>
                    Loading profile...
                  </div>
                ) : !isEditing ? (
                  <div>
                    {[
                      { icon: '👤', label: 'Full Name',     value: profile?.name     || user?.name  },
                      { icon: '📧', label: 'Email Address', value: profile?.email    || user?.email },
                      { icon: '📱', label: 'Phone Number',  value: profile?.phone                  },
                      { icon: '📍', label: 'Location',      value: profile?.location               },
                      { icon: '⚡', label: 'Role',           value: 'Super Admin'                   },
                    ].map((item, i) => (
                      <div key={i} className="d-flex align-items-center gap-3 py-2 border-bottom">
                        <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: 32, height: 32, background: '#f0f2f5', fontSize: '0.9rem' }}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-muted text-uppercase"
                            style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>
                            {item.label}
                          </div>
                          <div className="fw-medium" style={{ fontSize: '0.85rem' }}>
                            {item.value || '—'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    {([
                      { label: 'Full Name',    key: 'name',     placeholder: 'Enter full name'  },
                      { label: 'Phone Number', key: 'phone',    placeholder: '+92 300 0000000'  },
                      { label: 'Location',     key: 'location', placeholder: 'City, Pakistan'   },
                    ] as { label: string; key: keyof UpdateProfileCommand; placeholder: string }[]).map((field, i) => (
                      <div className="mb-3" key={i}>
                        <label className="form-label small fw-bold text-uppercase text-muted mb-1"
                          style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                          {field.label}
                        </label>
                        <input
                          type="text" className="form-control"
                          placeholder={field.placeholder}
                          value={formData[field.key]}
                          onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                          style={{ fontSize: '0.85rem', borderRadius: 8 }}
                        />
                      </div>
                    ))}
                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-sm fw-bold px-3"
                        style={{ background: '#1e2d45', color: '#fff', borderRadius: 8 }}
                        onClick={handleSave} disabled={isPending}>
                        {isPending ? 'Saving...' : '💾 Save Changes'}
                      </button>
                      <button className="btn btn-sm btn-outline-secondary px-3"
                        style={{ borderRadius: 8 }}
                        onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-12 col-lg-6 d-flex flex-column gap-4">

            {/* Change Password */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span className="rounded-circle d-inline-block"
                      style={{ width: 8, height: 8, background: '#3b5bdb' }} />
                    Change Password
                  </h6>
                  <span className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                    3-Step Verification
                  </span>
                </div>
                <div className="rounded-3 p-3 mb-3"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div className="text-muted fw-bold mb-2" style={{ fontSize: '0.75rem' }}>
                    How it works:
                  </div>
                  {[
                    { step: 1, color: '#3b5bdb', text: 'Enter your <strong>current password</strong> to verify identity' },
                    { step: 2, color: '#c89b2a', text: 'Receive a <strong>6-digit OTP</strong> on your registered email' },
                    { step: 3, color: '#2f9e44', text: 'Set your <strong>new password</strong> with strength requirements' },
                  ].map(item => (
                    <div key={item.step} className="d-flex align-items-center gap-2 mb-2"
                      style={{ fontSize: '0.78rem' }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: 22, height: 22, background: item.color,
                          color: '#fff', fontSize: '0.62rem' }}>
                        {item.step}
                      </div>
                      <span dangerouslySetInnerHTML={{ __html: item.text }} />
                    </div>
                  ))}
                </div>
                <button className="btn w-100 fw-bold"
                  style={{ background: '#3b5bdb', color: '#fff', borderRadius: 8, fontSize: '0.85rem' }}>
                  🔐 Change Password
                </button>
              </div>
            </div>

            {/* System Info */}
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <span className="rounded-circle d-inline-block"
                      style={{ width: 8, height: 8, background: '#2f9e44' }} />
                    System Overview
                  </h6>
                </div>
                {[
                  { icon: '🏢', bg: '#ebf0ff', label: 'Organizations',    value: `${stats?.totalOrganizations ?? 0} registered`        },
                  { icon: '👥', bg: '#f0fff4', label: 'Active Users',      value: `${stats?.totalActiveUsers   ?? 0} across all orgs`   },
                  { icon: '⏳', bg: '#fff8e1', label: 'Trials Expiring',   value: `${stats?.expiringIn3Days    ?? 0} in next 3 days`     },
                  { icon: '💰', bg: '#fff0f0', label: 'Total Revenue',     value: `PKR ${(stats?.totalRevenue  ?? 0).toLocaleString()}` },
                ].map((item, i) => (
                  <div key={i} className="d-flex gap-3 align-items-center py-2 border-bottom">
                    <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: 32, height: 32, background: item.bg, fontSize: '0.85rem' }}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-muted text-uppercase"
                        style={{ fontSize: '0.62rem', letterSpacing: '0.05em' }}>
                        {item.label}
                      </div>
                      <div className="fw-medium" style={{ fontSize: '0.83rem' }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};