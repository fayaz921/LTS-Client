import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePetitioners, useCreatePetitioner, useUpdatePetitioner, useDeletePetitioner } from '../hooks/usePetitioners'
import type { PetitionerDto } from '../types/petitioner.types'
import { formatDate } from '../../../shared/utils/formatDate'
import { useAuthStore } from '../../../store/authStore'
import '../styles/petitioners.css'

const emptyForm = {
    name: '',
    address: '',
    phone: '',
    mobile: '',
    business: '',
    email: '',
    cnic: '',
}

const PetitionersPage = () => {
    const { user } = useAuthStore()
    const { data, isError } = usePetitioners()
    const createMutation = useCreatePetitioner()
    const updateMutation = useUpdatePetitioner()
    const deleteMutation = useDeletePetitioner()

    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState<PetitionerDto | null>(null)
    const [form, setForm] = useState(emptyForm)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [search, setSearch] = useState('')

    const petitioners = data?.data ?? []

    const filtered = petitioners.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.cnic?.toLowerCase().includes(search.toLowerCase()) ||
        p.email?.toLowerCase().includes(search.toLowerCase())
    )

    const handleOpenCreate = () => {
        setEditItem(null)
        setForm(emptyForm)
        setShowForm(true)
    }

    const handleOpenEdit = (p: PetitionerDto) => {
        setEditItem(p)
        setForm({
            name: p.name,
            address: p.address ?? '',
            phone: p.phone ?? '',
            mobile: p.mobile ?? '',
            business: p.business ?? '',
            email: p.email ?? '',
            cnic: p.cnic ?? '',
        })
        setShowForm(true)
    }

    const handleSubmit = () => {
        if (!form.name.trim()) return alert('Name is required')

        if (editItem) {
            updateMutation.mutate({
                id: editItem.id,
                data: { ...form, id: editItem.id, updatedBy: '' }
            }, {
                onSuccess: () => { setShowForm(false); setForm(emptyForm) }
            })
        } else {
            createMutation.mutate({
                ...form,
                organizationId: user?.organizationId ?? '',
                createdBy: user?.id ?? '',
            }, {
                onSuccess: () => { setShowForm(false); setForm(emptyForm) }
            })
        }
    }

    const handleDelete = () => {
        if (!deleteId) return
        deleteMutation.mutate(deleteId, {
            onSuccess: () => setDeleteId(null)
        })
    }

    if (isError) return (
        <div className="lts-page__error">
            Failed to load petitioners. Please try again.
        </div>
    )

    return (
        <div className="lts-page">

            {/* Page Header */}
            <div className="lts-page__header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg,#1B2A4A 0%,#2A3F70 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '20px', flexShrink: 0,
                    }}>👤</div>
                <div>
                    <h1 className="lts-page__title">Petitioners</h1>
                    <p className="lts-page__subtitle">Manage all petitioners linked to your cases</p>
                </div>
                </div>
                <motion.button
                    className="lts-btn lts-btn--primary"
                    onClick={handleOpenCreate}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                >
                    + Add Petitioner
                </motion.button>
            </div>

            {/* Search */}
            <div className="lts-page__search">
                <span>🔍</span>
                <input
                    type="text"
                    placeholder="Search by name, CNIC or email..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="lts-card">
                <div className="lts-table-wrapper">
                    <table className="lts-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>CNIC</th>
                                <th>Phone</th>
                                <th>Mobile</th>
                                <th>Email</th>
                                <th>Business</th>
                                <th>Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="lts-table__empty">
                                        No petitioners found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((p, i) => (
                                    <motion.tr
                                        key={p.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                    >
                                        <td>{i + 1}</td>
                                        <td className="lts-table__name">{p.name}</td>
                                        <td>{p.cnic ?? '—'}</td>
                                        <td>{p.phone ?? '—'}</td>
                                        <td>{p.mobile ?? '—'}</td>
                                        <td>{p.email ?? '—'}</td>
                                        <td>{p.business ?? '—'}</td>
                                        <td>{formatDate(p.createdAt)}</td>
                                        <td>
                                            <div className="lts-table__actions">
                                                <motion.button
                                                    className="lts-btn-icon lts-btn-icon--edit"
                                                    onClick={() => handleOpenEdit(p)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Edit"
                                                >
                                                    ✏
                                                </motion.button>
                                                <motion.button
                                                    className="lts-btn-icon lts-btn-icon--delete"
                                                    onClick={() => setDeleteId(p.id)}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Delete"
                                                >
                                                    🗑
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create / Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        className="lts-modal__overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            className="lts-modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="lts-modal__header">
                                <h2 className="lts-modal__title">
                                    {editItem ? 'Edit Petitioner' : 'Add New Petitioner'}
                                </h2>
                                <button className="lts-modal__close" onClick={() => setShowForm(false)}>✕</button>
                            </div>

                            <div className="lts-modal__body">
                                <div className="lts-form__grid">
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">Full Name <span>*</span></label>
                                        <input
                                            className="lts-form__input"
                                            placeholder="Enter full name"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">CNIC</label>
                                        <input
                                            className="lts-form__input"
                                            placeholder="e.g. 12345-1234567-1"
                                            value={form.cnic}
                                            onChange={e => setForm({ ...form, cnic: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">Phone</label>
                                        <input
                                            className="lts-form__input"
                                            placeholder="Phone number"
                                            value={form.phone}
                                            onChange={e => setForm({ ...form, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">Mobile</label>
                                        <input
                                            className="lts-form__input"
                                            placeholder="Mobile number"
                                            value={form.mobile}
                                            onChange={e => setForm({ ...form, mobile: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">Email</label>
                                        <input
                                            className="lts-form__input"
                                            type="email"
                                            placeholder="Email address"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group">
                                        <label className="lts-form__label">Business</label>
                                        <input
                                            className="lts-form__input"
                                            placeholder="Business or organization"
                                            value={form.business}
                                            onChange={e => setForm({ ...form, business: e.target.value })}
                                        />
                                    </div>
                                    <div className="lts-form__group lts-form__group--full">
                                        <label className="lts-form__label">Address</label>
                                        <textarea
                                            className="lts-form__input lts-form__textarea"
                                            placeholder="Full address"
                                            value={form.address}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="lts-modal__footer">
                                <button className="lts-btn lts-btn--ghost" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                                <motion.button
                                    className="lts-btn lts-btn--primary"
                                    onClick={handleSubmit}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                >
                                    {createMutation.isPending || updateMutation.isPending
                                        ? 'Saving...'
                                        : editItem ? 'Update Petitioner' : 'Add Petitioner'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirm Modal */}
            <AnimatePresence>
                {deleteId && (
                    <motion.div
                        className="lts-modal__overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteId(null)}
                    >
                        <motion.div
                            className="lts-modal lts-modal--sm"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="lts-modal__header">
                                <h2 className="lts-modal__title">Delete Petitioner</h2>
                                <button className="lts-modal__close" onClick={() => setDeleteId(null)}>✕</button>
                            </div>
                            <div className="lts-modal__body">
                                <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
                                    Are you sure you want to delete this petitioner? This action cannot be undone.
                                </p>
                            </div>
                            <div className="lts-modal__footer">
                                <button className="lts-btn lts-btn--ghost" onClick={() => setDeleteId(null)}>
                                    Cancel
                                </button>
                                <motion.button
                                    className="lts-btn lts-btn--danger"
                                    onClick={handleDelete}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    disabled={deleteMutation.isPending}
                                >
                                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default PetitionersPage
