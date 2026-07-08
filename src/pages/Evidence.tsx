import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "../components/ui/PageHeader";
import { PageShell } from "../components/ui/PageShell";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";

interface EvidenceItem {
  Evidence_ID?: number;
  Evidence_Type: string;
  Description?: string;
  Case_ID?: number | { Case_Status?: string; Description?: string } | null;
}

interface CaseOption {
  Case_ID: number;
  Description: string;
  Case_Status: string;
}

const emptyForm = { Evidence_Type: "", Description: "", Case_ID: "" };

export default function Evidence() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<EvidenceItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const limit = 10;

  const { data: evidenceData, isLoading } = useQuery({
    queryKey: ['evidence', page, limit],
    queryFn: async () => {
      const res = await api.get(`/officer/evidence?page=${page}&limit=${limit}`);
      return res.data;
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
      if (editing) return api.put(`/officer/evidence/${editing.Evidence_ID}`, payload);
      return api.post("/officer/evidence", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      toast.success(editing ? "Evidence updated successfully" : "Evidence logged successfully");
      setShowModal(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save evidence");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/evidence/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['evidence'] });
      toast.success("Evidence deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete evidence");
    }
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (e: EvidenceItem) => {
    setEditing(e);
    setForm({
      Evidence_Type: e.Evidence_Type,
      Description: e.Description || "",
      Case_ID: e.Case_ID ? String(e.Case_ID) : "",
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      Evidence_Type: form.Evidence_Type,
      Description: form.Description,
      Case_ID: form.Case_ID ? Number(form.Case_ID) : null,
    };
    saveMutation.mutate(payload);
  };

  const handleDelete = (e: EvidenceItem) => {
    if (confirm("Confirm deletion of this evidence log?")) {
      if (e.Evidence_ID) deleteMutation.mutate(e.Evidence_ID);
    }
  };

  const columns = [
    { 
      header: "Evidence Category", 
      accessorKey: "Evidence_Type" as keyof EvidenceItem,
      cell: (item: EvidenceItem) => <span className="font-semibold text-white">{item.Evidence_Type}</span>
    },
    { 
      header: "Detailed Tracking", 
      grow: true,
      cell: (item: EvidenceItem) => <div className="truncate text-slate-400" title={item.Description}>{item.Description || "—"}</div>
    },
    { 
      header: "Linked Case", 
      grow: true,
      cell: (item: EvidenceItem) => (
        <div className="truncate text-slate-400" title={(item.Case_ID as any)?.Description}>
          <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md text-xs font-medium mr-2">Link</span>
          {(item.Case_ID as any)?.Description || "—"}
        </div>
      )
    }
  ];

  const totalPages = evidenceData?.total ? Math.ceil(evidenceData.total / limit) : 0;

  return (
    <PageShell>
      <PageHeader 
        title="Evidence Locker"
        subtitle="Secure storage and logging for case evidence."
        onAdd={openCreate}
        addButtonText="Log Evidence"
      />

      {isLoading ? (
        <div className="glass-dark rounded-2xl border border-slate-700/50 flex justify-center p-12 text-slate-400">Accessing evidence locker...</div>
      ) : (
        <DataTable 
          data={evidenceData?.data || []} 
          columns={columns} 
          onEdit={openEdit} 
          onDelete={handleDelete}
          emptyMessage="Locker is empty."
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${p === page ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <CrudModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Evidence Log"
        isEditing={!!editing}
        onSubmit={handleSave}
        isSaving={saveMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Evidence Category *</label>
          <input
            value={form.Evidence_Type}
            onChange={(e) => setForm((f) => ({ ...f, Evidence_Type: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            placeholder="e.g. CCTV Footage, Weapon, Digital Media..."
            required
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Detailed Description</label>
          <textarea
            value={form.Description}
            onChange={(e) => setForm((f) => ({ ...f, Description: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
            placeholder="Provide precise details for the evidence manifest..."
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Linked Case *</label>
          <select
            value={form.Case_ID}
            onChange={(e) => setForm((f) => ({ ...f, Case_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Attach to a case file</option>
            {cases?.map((c) => (
              <option key={c.Case_ID} value={String(c.Case_ID)}>
                {c.Description || c.Case_ID} — ({c.Case_Status})
              </option>
            ))}
          </select>
        </div>
      </CrudModal>
    </PageShell>
  );
}
