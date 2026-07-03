import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";

interface ArrestItem {
  Arrest_ID?: number;
  Arrest_Date: string;
  Charges?: string;
  Criminal_ID?: number | { Criminal_Name?: string } | null;
  Case_ID?: number | { Case_Status?: string; Description?: string } | null;
}

interface Criminal {
  Criminal_ID: number;
  Criminal_Name: string;
}

interface CaseOption {
  Case_ID: number;
  Description: string;
  Case_Status: string;
}

const emptyForm = {
  Arrest_Date: "",
  Criminal_ID: "",
  Case_ID: "",
  Charges: "",
};

export default function Arrests() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ArrestItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const limit = 10;

  const { data: arrestsData, isLoading } = useQuery({
    queryKey: ['arrests', page, limit],
    queryFn: async () => {
      const res = await api.get(`/officer/arrests?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const { data: criminals } = useQuery({
    queryKey: ['criminals-options'],
    queryFn: async () => {
      const res = await api.get("/officer/criminals?limit=100");
      return res.data.data as Criminal[];
    }
  });

  const { data: cases } = useQuery({
    queryKey: ['cases-options'],
    queryFn: async () => {
      const res = await api.get("/officer/cases?limit=100");
      return res.data.data as CaseOption[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editing) return api.put(`/officer/arrests/${editing.Arrest_ID}`, payload);
      return api.post("/officer/arrests", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arrests'] });
      toast.success(editing ? "Arrest record updated" : "Arrest filed successfully");
      setShowModal(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save arrest record");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/arrests/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['arrests'] });
      toast.success("Arrest record deleted");
    },
    onError: () => {
      toast.error("Failed to delete arrest record");
    }
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (a: ArrestItem) => {
    setEditing(a);
    setForm({
      Arrest_Date: a.Arrest_Date ? a.Arrest_Date.slice(0, 10) : "",
      Criminal_ID: a.Criminal_ID ? String(a.Criminal_ID) : "",
      Case_ID: a.Case_ID ? String(a.Case_ID) : "",
      Charges: a.Charges || "",
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Arrest_Date: form.Arrest_Date,
      Criminal_ID: form.Criminal_ID ? Number(form.Criminal_ID) : null,
      Case_ID: form.Case_ID ? Number(form.Case_ID) : null,
      Charges: form.Charges,
    };
    saveMutation.mutate(payload);
  };

  const handleDelete = (a: ArrestItem) => {
    if (confirm("Confirm deletion of this arrest record?")) {
      if (a.Arrest_ID) deleteMutation.mutate(a.Arrest_ID);
    }
  };

  const columns = [
    { 
      header: "Apprehended Target", 
      cell: (item: ArrestItem) => {
        if (typeof item.Criminal_ID === "number" && criminals) {
          return criminals.find((c) => c.Criminal_ID === item.Criminal_ID)?.Criminal_Name || "—";
        }
        return (item.Criminal_ID as any)?.Criminal_Name || "—";
      }
    },
    { 
      header: "Timestamp", 
      cell: (item: ArrestItem) => item.Arrest_Date ? new Date(item.Arrest_Date).toLocaleDateString() : "—"
    },
    { 
      header: "Formal Charges", 
      cell: (item: ArrestItem) => <div className="max-w-xs truncate text-slate-400">{item.Charges || "—"}</div>
    },
    { 
      header: "Case Link Status", 
      cell: (item: ArrestItem) => (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300">
          {(item.Case_ID as any)?.Case_Status || "Unknown"}
        </span>
      )
    }
  ];

  const totalPages = arrestsData?.total ? Math.ceil(arrestsData.total / limit) : 0;

  return (
    <div className="animate-fade-in font-sans">
      <PageHeader 
        title="Arrest Records"
        subtitle="Official logs of apprehensions and detentions."
        onAdd={openCreate}
        addButtonText="File Arrest"
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-slate-400">Retrieving arrest histories...</div>
      ) : (
        <DataTable 
          data={arrestsData?.data || []} 
          columns={columns} 
          onEdit={openEdit} 
          onDelete={handleDelete}
          emptyMessage="No arrest records found."
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${p === page ? "bg-white text-slate-950 shadow-lg" : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <CrudModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Arrest Protocol"
        isEditing={!!editing}
        onSubmit={handleSave}
        isSaving={saveMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Apprehended Criminal *</label>
          <select
            value={form.Criminal_ID}
            onChange={(e) => setForm((f) => ({ ...f, Criminal_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Select registry match</option>
            {criminals?.map((c) => (
              <option key={c.Criminal_ID} value={String(c.Criminal_ID)}>{c.Criminal_Name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Linked Case *</label>
          <select
            value={form.Case_ID}
            onChange={(e) => setForm((f) => ({ ...f, Case_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Select case</option>
            {cases?.map((c) => (
              <option key={c.Case_ID} value={String(c.Case_ID)}>
                {c.Case_ID} — {c.Case_Status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Arrest Date *</label>
          <input
            type="date"
            value={form.Arrest_Date}
            onChange={(e) => setForm((f) => ({ ...f, Arrest_Date: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Formal Charges</label>
          <textarea
            value={form.Charges}
            onChange={(e) => setForm((f) => ({ ...f, Charges: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
            placeholder="e.g. Armed Robbery under PC 211. State exact clauses."
          />
        </div>
      </CrudModal>
    </div>
  );
}
