import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CourtDto, CourtFormValues, ModalMode } from "../types/court.types";
import {
  getAllCourts,
  createCourt,
  updateCourt,
  deleteCourt,
} from "../api/courtApi";

// ─── Toast ────────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error";
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let _toastId = 0;

// ─── Filter type ──────────────────────────────────────────────────────────────
export type StatusFilter = "all" | "active" | "inactive";

const KEYS = {
  all: ["courts"],
};

export const useGetCourts = (enabled: boolean = true) =>
  useQuery({
    queryKey: KEYS.all,
    queryFn: () => getAllCourts(true),
    enabled,
  });

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCourt() {
  // ── data ──────────────────────────────────────────────────────────────────
  const [courts, setCourts] = useState<CourtDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // ── ui ────────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<CourtDto | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // ── derived: client-side search filter on top of fetched data ─────────────
  const filtered = courts.filter((c) => {
    const matchesSearch =
      c.courtName.toLowerCase().includes(search.toLowerCase()) ||
      (c.addressContact ?? "").toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: courts.length,
    active: courts.filter((c) => c.isActive).length,
    inactive: courts.filter((c) => !c.isActive).length,
  };

  // ── toast ─────────────────────────────────────────────────────────────────
  const pushToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = ++_toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(
        () => setToasts((prev) => prev.filter((t) => t.id !== id)),
        3500
      );
    },
    [] // ✅ stable — koi dependency nahi
  );

  // ── fetch ─────────────────────────────────────────────────────────────────
  // isActive param backend filter ke liye
  // undefined = sab (active + inactive dono)
  const fetchCourts = useCallback(
    async (filter: StatusFilter = statusFilter) => {
      setLoading(true);
      try {
        const isActiveParam =
          filter === "all" ? undefined : filter === "active";
        const res = await getAllCourts(isActiveParam);

        // ✅ status check — throw nahi, sirf handle karo
        if (res.status === 200 || res.status === 201) {
          setCourts(res.data ?? []);
        } else {
          pushToast(res.message ?? "Failed to load courts", "error");
        }
      } catch {
        // Yeh sirf tab hoga jab network completely fail ho
        pushToast("Network error — server se connect nahi ho saka", "error");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, pushToast]
  );

  useEffect(() => {
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        void fetchCourts(statusFilter);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fetchCourts, statusFilter]);

  // ── status filter change ───────────────────────────────────────────────────
  const changeStatusFilter = (f: StatusFilter) => {
    setStatusFilter(f);
    // useEffect upar wala handle karega
  };

  // ── modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => {
    setSelected(null);
    setModal("create");
  };

  const openEdit = (court: CourtDto) => {
    setSelected(court);
    setModal("edit");
  };

  const openDelete = (court: CourtDto) => {
    setSelected(court);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleCreate = async (values: CourtFormValues) => {
    setFormLoading(true);
    try {
      const res = await createCourt({
        courtName: values.courtName,
        addressContact: values.addressContact || undefined,
      });
      if (res.status === 201 || res.status === 200) {
        pushToast("Court created successfully");
        closeModal();
        fetchCourts(statusFilter);
      } else {
        pushToast(res.message ?? "Failed to create court", "error");
      }
    } catch {
      pushToast("Network error — please try again", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (values: CourtFormValues) => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await updateCourt(selected.id, {
        courtName: values.courtName,
        addressContact: values.addressContact || undefined,
        isActive: values.isActive,
      });
      if (res.status === 200) {
        pushToast("Court updated successfully");
        closeModal();
        fetchCourts(statusFilter);
      } else {
        pushToast(res.message ?? "Failed to update court", "error");
      }
    } catch {
      pushToast("Network error — please try again", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    setFormLoading(true);
    try {
      const res = await deleteCourt(selected.id);
      if (res.status === 200) {
        pushToast("Court deactivated successfully");
        closeModal();
        fetchCourts(statusFilter);
      } else {
        pushToast(res.message ?? "Failed to deactivate court", "error");
      }
    } catch {
      pushToast("Network error — please try again", "error");
    } finally {
      setFormLoading(false);
    }
  };

  return {
    // data
    courts,
    filtered,
    stats,
    loading,
    formLoading,
    selected,
    // ui
    search,
    setSearch,
    statusFilter,
    changeStatusFilter,
    modal,
    toasts,
    // actions
    openCreate,
    openEdit,
    openDelete,
    closeModal,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
