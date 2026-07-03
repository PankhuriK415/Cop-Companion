import { useState } from "react";
import api from "../lib/apiClient";
import { FolderOpen } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { useDebounce } from "../hooks/useDebounce";

interface CaseItem {
  Case_ID?: number;
  Case_Date: string;
  Case_Status: string;
  Description: string;
  Station_ID?: number | { Station_Name?: string } | null;
  Officer_ID?: number | { Officer_Name?: string } | null;
}

interface Station {
  Station_ID: number;
  Station_Name: string;
}

interface Officer {
  Officer_ID: number;
  Officer_Name: string;
}

const STATUS_OPTIONS = [
  "Open",
  "Closed",
  "Pending Review",
  "Under Investigation",
  "Dismissed",
];

const emptyForm = {
  Case_Date: "",
  Case_Status: "Open",
  Description: "",
  Station_ID: "",
  Officer_ID: "",
};

export default function Cases() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CaseItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const limit = 10;

  // Data Fetching
  const { data: casesData, isLoading } = useQuery({
    queryKey: ['cases', page, limit, debouncedSearch, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/officer/cases?${params}`);
      return res.data;
    }
  });

  const { data: stations } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const res = await api.get("/officer/stations");
      return res.data.data as Station[];
    }
  });

  const { data: officers } = useQuery({
    queryKey: ['officers'],
    queryFn: async () => {
      const res = await api.get("/officer/officers?limit=100");
      return res.data.data as Officer[];
    }
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editing) {
        return api.put(`/officer/cases/${editing.Case_ID}`, payload);
      }
      return api.post("/officer/cases", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success(editing ? "Case updated successfully" : "Case created successfully");
      setShowModal(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save case");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/cases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      toast.success("Case deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete case");
    }
  });

  // Handlers
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: CaseItem) => {
    setEditing(c);
    setForm({
      Case_Date: c.Case_Date ? c.Case_Date.slice(0, 10) : "",
      Case_Status: c.Case_Status,
      Description: c.Description || "",
      Station_ID:
        typeof c.Station_ID === "number"
          ? String(c.Station_ID)
          : c.Station_ID && (c.Station_ID as any).Station_ID
            ? String((c.Station_ID as any).Station_ID)
            : "",
      Officer_ID:
        typeof c.Officer_ID === "number"
          ? String(c.Officer_ID)
          : c.Officer_ID && (c.Officer_ID as any).Officer_ID
            ? String((c.Officer_ID as any).Officer_ID)
            : "",
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Case_Date: form.Case_Date,
      Case_Status: form.Case_Status,
      Description: form.Description,
      Station_ID: form.Station_ID ? Number(form.Station_ID) : null,
      Officer_ID: form.Officer_ID ? Number(form.Officer_ID) : null,
    };
    saveMutation.mutate(payload);
  };

  const handleDelete = (c: CaseItem) => {
    if (confirm("Confirm deletion of this case record? This action cannot be undone.")) {
      if (c.Case_ID) deleteMutation.mutate(c.Case_ID);
    }
  };

  // Table Config
  const columns = [
    { 
      header: "Summary", 
      accessorKey: "Description" as keyof CaseItem,
      cell: (item: CaseItem) => <div className="max-w-xs truncate">{item.Description || "—"}</div>
    },
    { 
      header: "Status", 
      cell: (item: CaseItem) => <StatusBadge status={item.Case_Status} />
    },
    { 
      header: "Lead Officer", 
      cell: (item: CaseItem) => {
        if (typeof item.Officer_ID === "number" && officers) {
          return officers.find(o => o.Officer_ID === item.Officer_ID)?.Officer_Name || "—";
        }
        return (item.Officer_ID as any)?.Officer_Name || "—";
      }
    },
    { 
      header: "Station Branch", 
      cell: (item: CaseItem) => {
        if (typeof item.Station_ID === "number" && stations) {
          return stations.find(s => s.Station_ID === item.Station_ID)?.Station_Name || "—";
        }
        return (item.Station_ID as any)?.Station_Name || "—";
      }
    },
    { 
      header: "Date Filed", 
      cell: (item: CaseItem) => item.Case_Date ? new Date(item.Case_Date).toLocaleDateString() : "—"
    },
  ];

  const totalPages = casesData?.total ? Math.ceil(casesData.total / limit) : 0;

  return (
    <div className="animate-fade-in font-sans">
      <PageHeader 
        title="Case Records"
        subtitle="Manage and track law enforcement case files."
        onAdd={openCreate}
        addButtonText="New Case"
        searchPlaceholder="Search descriptions..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      <div className="mb-6 flex">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[200px]"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 text-slate-400">Loading cases...</div>
      ) : (
        <DataTable 
          data={casesData?.data || []} 
          columns={columns} 
          onEdit={openEdit} 
          onDelete={handleDelete}
          emptyMessage="No cases found matching your criteria."
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${p === page ? "bg-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <CrudModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Case"
        isEditing={!!editing}
        onSubmit={handleSave}
        isSaving={saveMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Description</label>
          <textarea
            value={form.Description}
            onChange={(e) => setForm((f) => ({ ...f, Description: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Date Filed</label>
          <input
            type="date"
            value={form.Case_Date}
            onChange={(e) => setForm((f) => ({ ...f, Case_Date: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Status</label>
          <select
            value={form.Case_Status}
            onChange={(e) => setForm((f) => ({ ...f, Case_Status: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Operating Station</label>
          <select
            value={form.Station_ID}
            onChange={(e) => setForm((f) => ({ ...f, Station_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            <option value="">Select Station</option>
            {stations?.map((s) => (
              <option key={s.Station_ID} value={String(s.Station_ID)}>{s.Station_Name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Assigned Officer</label>
          <select
            value={form.Officer_ID}
            onChange={(e) => setForm((f) => ({ ...f, Officer_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            <option value="">Select Officer</option>
            {officers?.map((o) => (
              <option key={o.Officer_ID} value={String(o.Officer_ID)}>{o.Officer_Name}</option>
            ))}
          </select>
        </div>
      </CrudModal>
    </div>
  );
}
