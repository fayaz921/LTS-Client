import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useGetProfile, useUpdateProfile, useUpdateProfilePicture } from '../hooks/useProfile';
import type { UpdateProfileCommand } from '../types/profile.types';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const { data: profileData } = useGetProfile();
  const { mutate: saveProfile, isPending } = useUpdateProfile();
  const { mutate: uploadPicture, isPending: isUploading } = useUpdateProfilePicture();

  const profile = profileData?.data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditingState] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileCommand>({
    name: '',
    phone: '',
    location: '',
  });

  const setIsEditing = (val: boolean) => {
    isEditingRef.current = val;
    setIsEditingState(val);
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
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview ke liye
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Cloudinary pe upload karo
    uploadPicture(file);
  };

  const handleSave = () => {
    saveProfile(formData, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const avatarSrc = previewUrl || profile?.profilePictureUrl || user?.profileImage || null;

  return (
    <div className="container-fluid py-4">

      {/* HERO */}
      <div className="rounded-3 p-4 mb-4 text-white"
        style={{ background: 'linear-gradient(135deg, #1e2d45 0%, #263550 100%)' }}>
        <div className="small fw-bold text-uppercase mb-3" style={{ color: '#c89b2a', letterSpacing: '0.1em' }}>
          USER PROFILE
        </div>
        <div className="d-flex align-items-center gap-4 flex-wrap">

          {/* Avatar */}
          <div className="position-relative flex-shrink-0" style={{ cursor: 'pointer' }}
            onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="avatar"
                className="rounded-circle"
                style={{ width: 80, height: 80, objectFit: 'cover', border: '3px solid rgba(255,255,255,0.15)',
                  opacity: isUploading ? 0.6 : 1 }}
              />
            ) : (
              <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 80, height: 80, background: '#c89b2a', fontSize: '1.6rem',
                  border: '3px solid rgba(255,255,255,0.15)' }}>
                {initials}
              </div>
            )}
            <div className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: 24, height: 24, background: '#c89b2a', border: '2px solid #1e2d45', fontSize: '0.7rem' }}>
              {isUploading ? '⏳' : '📷'}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{user?.name || 'User'}</h1>
            <span className="badge mb-2 px-3 py-1" style={{ background: '#c89b2a', fontSize: '0.75rem' }}>
              ⭐ {user?.role || 'User'}
            </span>
            <div className="small" style={{ color: 'rgba(255,255,255,0.45)' }}>{user?.email}</div>
          </div>

          {/* Actions */}
          <div className="ms-auto">
            <button className="btn btn-sm fw-bold px-4"
              style={{ background: '#c89b2a', color: '#fff', borderRadius: 8 }}
              onClick={() => setIsEditing(!isEditingRef.current)}>
              ✏️ Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Active Cases',       value: '128', sub: '+12 this month',     color: '#3b5bdb' },
          { label: 'Upcoming Hearings',  value: '24',  sub: 'Next 7 days',        color: '#c89b2a' },
          { label: 'Pending Documents',  value: '36',  sub: 'Needs review',       color: '#e53e3e' },
          { label: 'Resolved Matters',   value: '412', sub: '+8.4% closure rate', color: '#2f9e44' },
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
                  <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: '#c89b2a' }} />
                  Personal Information
                </h6>
                <button className="btn btn-link btn-sm p-0 text-decoration-none fw-bold"
                  style={{ color: '#c89b2a' }}
                  onClick={() => setIsEditing(!isEditingRef.current)}>
                  ✏️ Edit
                </button>
              </div>

              {!isEditing ? (
                <div>
                  {[
                    { icon: '👤', label: 'Full Name',     value: profile?.name     || user?.name  },
                    { icon: '📧', label: 'Email Address', value: profile?.email    || user?.email },
                    { icon: '📱', label: 'Phone Number',  value: profile?.phone                  },
                    { icon: '📍', label: 'Location',      value: profile?.location               },
                    // { icon: '⚖️', label: 'Role',          value: user?.role                      },
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
                    { label: 'Full Name',     key: 'name',     placeholder: 'Enter full name'    },
                    { label: 'Phone Number',  key: 'phone',    placeholder: '+92 300 0000000'    },
                    { label: 'Location',      key: 'location', placeholder: 'City, Pakistan'     },
                  ] as { label: string; key: keyof UpdateProfileCommand; placeholder: string }[]).map((field, i) => (
                    <div className="mb-3" key={i}>
                      <label className="form-label small fw-bold text-uppercase text-muted mb-1"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.06em' }}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        className="form-control"
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
                      onClick={handleSave}
                      disabled={isPending}>
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
                  <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: '#3b5bdb' }} />
                  Change Password
                </h6>
                <span className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>3-Step Verification</span>
              </div>
              <div className="rounded-3 p-3 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div className="text-muted fw-bold mb-2" style={{ fontSize: '0.75rem' }}>How it works:</div>
                {[
                  { step: 1, color: '#3b5bdb', text: 'Enter your <strong>current password</strong> to verify identity' },
                  { step: 2, color: '#c89b2a', text: 'Receive a <strong>6-digit OTP</strong> on your registered email' },
                  { step: 3, color: '#2f9e44', text: 'Set your <strong>new password</strong> with strength requirements' },
                ].map(item => (
                  <div key={item.step} className="d-flex align-items-center gap-2 mb-2"
                    style={{ fontSize: '0.78rem' }}>
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                      style={{ width: 22, height: 22, background: item.color, color: '#fff', fontSize: '0.62rem' }}>
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

          {/* Recent Activity */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span className="rounded-circle d-inline-block" style={{ width: 8, height: 8, background: '#2f9e44' }} />
                  Recent Activity
                </h6>
                <a href="#" className="text-decoration-none fw-bold"
                  style={{ color: '#c89b2a', fontSize: '0.78rem' }}>View all</a>
              </div>
              {[
                { icon: '📁', bg: '#ebf0ff', text: 'Opened case <strong>#C-2024-089</strong> — Land Dispute',      time: '2 hours ago'        },
                { icon: '📄', bg: '#fff8e1', text: 'Uploaded document for <strong>Hearing #H-441</strong>',         time: 'Yesterday, 4:15 PM' },
                { icon: '🔔', bg: '#fff0f0', text: 'Sent alert to team for upcoming hearing',                       time: '2 days ago'         },
                { icon: '✅', bg: '#f0fff4', text: 'Resolved case <strong>#C-2024-071</strong> successfully',       time: '3 days ago'         },
              ].map((item, i) => (
                <div key={i} className="d-flex gap-3 align-items-start py-2 border-bottom">
                  <div className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 32, height: 32, background: item.bg, fontSize: '0.85rem' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.83rem', lineHeight: 1.4 }}
                      dangerouslySetInnerHTML={{ __html: item.text }} />
                    <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};