import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "../components/ui/PageHeader";
import { PageShell } from "../components/ui/PageShell";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";
import { useDebounce } from "../hooks/useDebounce";

interface Criminal {
  Criminal_ID?: number;
  Criminal_Name: string;
  Gender?: string;
  DOB?: string;
  Address?: string;
}

const emptyForm = { Criminal_Name: "", Gender: "", DOB: "", Address: "" };

export default function Criminals() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Criminal | null>(null);
  const [form, setForm] = useState(emptyForm);
  const limit = 10;

  const { data: criminalsData, isLoading } = useQuery({
    queryKey: ['criminals', page, limit, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await api.get(`/officer/criminals?${params}`);
      return res.data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editing) return api.put(`/officer/criminals/${editing.Criminal_ID}`, payload);
      return api.post("/officer/criminals", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criminals'] });
      toast.success(editing ? "Criminal profile updated" : "Criminal profile created");
      setShowModal(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to save criminal profile");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/criminals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criminals'] });
      toast.success("Criminal record deleted");
    },
    onError: () => {
      toast.error("Failed to delete criminal record");
    }
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (c: Criminal) => {
    setEditing(c);
    setForm({
      Criminal_Name: c.Criminal_Name,
      Gender: c.Gender || "",
      DOB: c.DOB ? c.DOB.slice(0, 10) : "",
      Address: c.Address || "",
    });
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const handleDelete = (c: Criminal) => {
    if (confirm("Confirm deletion of this criminal record?")) {
      if (c.Criminal_ID) deleteMutation.mutate(c.Criminal_ID);
    }
  };

  const columns = [
    { 
      header: "Name", 
      accessorKey: "Criminal_Name" as keyof Criminal,
      cell: (item: Criminal) => <span className="font-semibold text-white">{item.Criminal_Name}</span>
    },
    { 
      header: "Gender", 
      cell: (item: Criminal) => item.Gender ? (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 border border-slate-700">
          {item.Gender}
        </span>
      ) : "—"
    },
    { 
      header: "Date of Birth", 
      cell: (item: Criminal) => item.DOB ? new Date(item.DOB).toLocaleDateString() : "—"
    },
    { 
      header: "Address", 
      grow: true,
      cell: (item: Criminal) => <div className="truncate text-slate-400" title={item.Address}>{item.Address || "—"}</div>
    }
  ];

  const totalPages = criminalsData?.total ? Math.ceil(criminalsData.total / limit) : 0;

  return (
    <PageShell>
      <PageHeader 
        title="Criminal Database"
        subtitle="Manage criminal registries and profiles."
        onAdd={openCreate}
        addButtonText="Add Criminal"
        searchPlaceholder="Search by name or address..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
      />

      {isLoading ? (
        <div className="glass-dark rounded-2xl border border-slate-700/50 flex justify-center p-12 text-slate-400">Accessing criminal registry...</div>
      ) : (
        <DataTable 
          data={criminalsData?.data || []} 
          columns={columns} 
          onEdit={openEdit} 
          onDelete={handleDelete}
          emptyMessage="No criminal records found."
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
        title="Criminal Profile"
        isEditing={!!editing}
        onSubmit={handleSave}
        isSaving={saveMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Full Name *</label>
          <input
            value={form.Criminal_Name}
            onChange={(e) => setForm((f) => ({ ...f, Criminal_Name: e.target.value }))}
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
          <label className="text-sm font-medium text-slate-400">Date of Birth</label>
          <input
            type="date"
            value={form.DOB}
            onChange={(e) => setForm((f) => ({ ...f, DOB: e.target.value }))}
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
    </PageShell>
  );
}
