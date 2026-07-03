import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";

interface Victim {
  Victim_ID?: number;
  Victim_Name: string;
  Gender?: string;
  Phone?: string;
  Address?: string;
}

const emptyForm = { Victim_Name: "", Gender: "", Phone: "", Address: "" };

export default function Victims() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Victim | null>(null);
  const [form, setForm] = useState(emptyForm);
  const limit = 10;

  const { data: victimsData, isLoading } = useQuery({
    queryKey: ['victims', page, limit],
    queryFn: async () => {
      const res = await api.get(`/officer/victims?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editing) return api.put(`/officer/victims/${editing.Victim_ID}`, payload);
      return api.post("/officer/victims", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victims'] });
      toast.success(editing ? "Victim record updated" : "Victim record created");
      setShowModal(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save victim record");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/victims/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['victims'] });
      toast.success("Victim record deleted");
    },
    onError: () => {
      toast.error("Failed to delete victim record");
    }
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (v: Victim) => {
    setEditing(v);
    setForm({
      Victim_Name: v.Victim_Name,
      Gender: v.Gender || "",
      Phone: v.Phone || "",
      Address: v.Address || "",
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleDelete = (v: Victim) => {
    if (confirm("Confirm deletion of this victim record?")) {
      if (v.Victim_ID) deleteMutation.mutate(v.Victim_ID);
    }
  };

  const columns = [
    { 
      header: "Name", 
      accessorKey: "Victim_Name" as keyof Victim,
      cell: (item: Victim) => <span className="font-semibold">{item.Victim_Name}</span>
    },
    { 
      header: "Gender", 
      cell: (item: Victim) => item.Gender ? (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700">
          {item.Gender}
        </span>
      ) : "—"
    },
    { 
      header: "Contact Number", 
      cell: (item: Victim) => <span className="font-mono">{item.Phone || "—"}</span>
    },
    { 
      header: "Address", 
      cell: (item: Victim) => <div className="max-w-xs truncate text-slate-400">{item.Address || "—"}</div>
    }
  ];

  const totalPages = victimsData?.total ? Math.ceil(victimsData.total / limit) : 0;

  return (
    <div className="animate-fade-in font-sans">
      <PageHeader 
        title="Victim Registry"
        subtitle="Protected database of affected individuals."
        onAdd={openCreate}
        addButtonText="Add Victim"
      />

      {isLoading ? (
        <div className="flex justify-center p-12 text-slate-400">Securely fetching details...</div>
      ) : (
        <DataTable 
          data={victimsData?.data || []} 
          columns={columns} 
          onEdit={openEdit} 
          onDelete={handleDelete}
          emptyMessage="Registry is currently empty."
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
        title="Victim Detail"
        isEditing={!!editing}
        onSubmit={handleSave}
        isSaving={saveMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Full Name *</label>
          <input
            value={form.Victim_Name}
            onChange={(e) => setForm((f) => ({ ...f, Victim_Name: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Gender</label>
          <select
            value={form.Gender}
            onChange={(e) => setForm((f) => ({ ...f, Gender: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            <option value="">Select gender</option>
            {["Male", "Female", "Other"].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Contact Phone</label>
          <input
            value={form.Phone}
            onChange={(e) => setForm((f) => ({ ...f, Phone: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Address</label>
          <textarea
            value={form.Address}
            onChange={(e) => setForm((f) => ({ ...f, Address: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
          />
        </div>
      </CrudModal>
    </div>
  );
}
