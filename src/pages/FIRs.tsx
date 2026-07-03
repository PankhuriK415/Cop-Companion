import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";

interface FIRItem {
  FIR_No?: number;
  FIR_Date: string;
  Victim_ID?: number | { Victim_Name?: string } | null;
  Case_ID?: number | { Case_Status?: string; Description?: string } | null;
}

interface VictimOption {
  Victim_ID: number;
  Victim_Name: string;
}

interface CaseOption {
  Case_ID: number;
  Description: string;
  Case_Status: string;
}

interface NewVictimForm {
  Victim_Name: string;
  Gender: "Male" | "Female" | "Other" | "";
  Phone: string;
  Address: string;
}

const emptyForm = { FIR_Date: "", Victim_ID: "", Case_ID: "" };
const emptyVictimForm: NewVictimForm = {
  Victim_Name: "",
  Gender: "",
  Phone: "",
  Address: "",
};

export default function FIRs() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showVictimModal, setShowVictimModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [victimForm, setVictimForm] = useState<NewVictimForm>(emptyVictimForm);
  const limit = 10;

  const { data: firsData, isLoading } = useQuery({
    queryKey: ['firs', page, limit],
    queryFn: async () => {
      const res = await api.get(`/officer/firs?page=${page}&limit=${limit}`);
      return res.data;
    }
  });

  const { data: victims } = useQuery({
    queryKey: ['victims-options'],
    queryFn: async () => {
      const res = await api.get("/officer/victims?limit=100");
      return res.data.data as VictimOption[];
    }
  });

  const { data: cases } = useQuery({
    queryKey: ['cases-options'],
    queryFn: async () => {
      const res = await api.get("/officer/cases?limit=100");
      return res.data.data as CaseOption[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.post("/officer/firs", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firs'] });
      toast.success("FIR filed successfully");
      setShowModal(false);
      setForm(emptyForm);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create FIR");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/firs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firs'] });
      toast.success("FIR deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete FIR");
    }
  });

  const createVictimMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/officer/victims", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['victims-options'] });
      if (data?.Victim_ID) {
        setForm((prev) => ({ ...prev, Victim_ID: data.Victim_ID }));
      }
      toast.success("Victim profile created");
      setShowVictimModal(false);
      setVictimForm(emptyVictimForm);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add victim");
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      FIR_Date: form.FIR_Date,
      Case_ID: form.Case_ID ? Number(form.Case_ID) : null,
      Victim_ID: form.Victim_ID ? Number(form.Victim_ID) : null,
    };
    createMutation.mutate(payload);
  };

  const handleCreateVictim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!victimForm.Victim_Name.trim()) {
      toast.error("Victim name is required");
      return;
    }
    const payload = {
      Victim_Name: victimForm.Victim_Name.trim(),
      Gender: victimForm.Gender || undefined,
      Phone: victimForm.Phone.trim() || undefined,
      Address: victimForm.Address.trim() || undefined,
    };
    createVictimMutation.mutate(payload);
  };

  const handleDelete = (f: FIRItem) => {
    if (confirm("Delete this FIR? This action cannot be undone.")) {
      if (f.FIR_No) deleteMutation.mutate(f.FIR_No);
    }
  };

  const columns = [
    { 
      header: "Filing Date", 
      cell: (item: FIRItem) => <span className="font-mono text-sm">{new Date(item.FIR_Date).toLocaleDateString()}</span>
    },
    { 
      header: "Victim", 
      cell: (item: FIRItem) => <span className="font-semibold">{(item.Victim_ID as any)?.Victim_Name || "—"}</span>
    },
    { 
      header: "Case Status", 
      cell: (item: FIRItem) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium border border-slate-700 bg-slate-800 text-slate-300 shadow-sm">
          {(item.Case_ID as any)?.Case_Status || "Unknown"}
        </span>
      )
    }
  ];

  const totalPages = firsData?.total ? Math.ceil(firsData.total / limit) : 0;

  return (
    <div className="animate-fade-in font-sans">
      <PageHeader 
        title="FIR Records"
        subtitle="First Information Reports registry."
        onAdd={() => {
          setForm(emptyForm);
          setShowModal(true);
        }}
        addButtonText="File FIR"
      />

      <div className="mb-8 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm inline-block">
        <span className="font-bold">Attention:</span> FIR records are immutable and cannot be edited once firmly filed in the system.
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 text-slate-400">Retrieving legal documents...</div>
      ) : (
        <DataTable 
          data={firsData?.data || []} 
          columns={columns} 
          onDelete={handleDelete}
          emptyMessage="No FIRs filed."
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
        title="FIR Draft"
        isEditing={false}
        onSubmit={handleCreate}
        isSaving={createMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Date of Filing *</label>
          <input
            type="date"
            value={form.FIR_Date}
            onChange={(e) => setForm((f) => ({ ...f, FIR_Date: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-400">Select Victim *</label>
            <button
              type="button"
              onClick={() => {
                setVictimForm(emptyVictimForm);
                setShowVictimModal(true);
              }}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              <UserPlus className="h-3 w-3" /> New
            </button>
          </div>
          <select
            value={form.Victim_ID}
            onChange={(e) => setForm((f) => ({ ...f, Victim_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Choose a victim profile</option>
            {victims?.map((v) => (
              <option key={v.Victim_ID} value={String(v.Victim_ID)}>{v.Victim_Name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Associated Case *</label>
          <select
            value={form.Case_ID}
            onChange={(e) => setForm((f) => ({ ...f, Case_ID: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Select linked case</option>
            {cases?.map((c) => (
              <option key={c.Case_ID} value={String(c.Case_ID)}>
                {c.Case_ID} — {c.Case_Status}
              </option>
            ))}
          </select>
        </div>
      </CrudModal>

      <CrudModal
        isOpen={showVictimModal}
        onClose={() => setShowVictimModal(false)}
        title="Register Victim"
        isEditing={false}
        onSubmit={handleCreateVictim}
        isSaving={createVictimMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Victim Name *</label>
          <input
            value={victimForm.Victim_Name}
            onChange={(e) => setVictimForm((v) => ({ ...v, Victim_Name: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Gender</label>
          <select
            value={victimForm.Gender}
            onChange={(e) => setVictimForm((v) => ({ ...v, Gender: e.target.value as any }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Phone Number</label>
          <input
            value={victimForm.Phone}
            onChange={(e) => setVictimForm((v) => ({ ...v, Phone: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Address</label>
          <textarea
            value={victimForm.Address}
            onChange={(e) => setVictimForm((v) => ({ ...v, Address: e.target.value }))}
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
          />
        </div>
      </CrudModal>
    </div>
  );
}
