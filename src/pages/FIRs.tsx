import { useState } from "react";
import api from "../lib/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { FolderPlus, UserPlus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { PageShell } from "../components/ui/PageShell";
import { DataTable } from "../components/ui/DataTable";
import { CrudModal } from "../components/ui/CrudModal";

interface FIRItem {
  FIR_No?: number;
  FIR_Date: string;
  Victim_ID?: number | { Victim_Name?: string } | null;
  Case_ID?: number | { Case_Status?: string; Description?: string } | null;
  Victim?: { Victim_ID: number; Victim_Name?: string };
  Case?: { Case_ID: number; Case_Status?: string; Description?: string };
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

interface NewCaseForm {
  Description: string;
  Case_Date: string;
  Case_Status: string;
}

const STATUS_OPTIONS = [
  "Open",
  "Under Investigation",
  "Pending Review",
  "Closed",
  "Dismissed",
];

const emptyForm = { FIR_Date: "", Victim_ID: "", Case_ID: "" };
const emptyVictimForm: NewVictimForm = {
  Victim_Name: "",
  Gender: "",
  Phone: "",
  Address: "",
};
const emptyCaseForm = (): NewCaseForm => ({
  Description: "",
  Case_Date: new Date().toISOString().slice(0, 10),
  Case_Status: "Open",
});

export default function FIRs() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showVictimModal, setShowVictimModal] = useState(false);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [victimForm, setVictimForm] = useState<NewVictimForm>(emptyVictimForm);
  const [caseForm, setCaseForm] = useState<NewCaseForm>(emptyCaseForm);
  /** Holds a newly typed case until FIR is saved (created atomically with FIR) */
  const [pendingNewCase, setPendingNewCase] = useState<NewCaseForm | null>(null);
  const limit = 10;

  const { data: firsData, isLoading } = useQuery({
    queryKey: ["firs", page, limit],
    queryFn: async () => {
      const res = await api.get(`/officer/firs?page=${page}&limit=${limit}`);
      return res.data;
    },
  });

  const { data: victims } = useQuery({
    queryKey: ["victims-options"],
    queryFn: async () => {
      const res = await api.get("/officer/victims?limit=100");
      return res.data.data as VictimOption[];
    },
  });

  const { data: cases } = useQuery({
    queryKey: ["cases-options"],
    queryFn: async () => {
      const res = await api.get("/officer/cases?limit=100");
      return res.data.data as CaseOption[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.post("/officer/firs", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firs"] });
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      queryClient.invalidateQueries({ queryKey: ["cases-options"] });
      toast.success("FIR filed successfully");
      setShowModal(false);
      setForm(emptyForm);
      setPendingNewCase(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create FIR");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return api.delete(`/officer/firs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["firs"] });
      toast.success("FIR deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete FIR");
    },
  });

  const createVictimMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/officer/victims", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["victims-options"] });
      if (data?.Victim_ID) {
        setForm((prev) => ({ ...prev, Victim_ID: String(data.Victim_ID) }));
      }
      toast.success("Victim profile created");
      setShowVictimModal(false);
      setVictimForm(emptyVictimForm);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add victim");
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Victim_ID) {
      toast.error("Please select a victim");
      return;
    }
    if (!form.Case_ID && !pendingNewCase) {
      toast.error("Select an existing case or create a new one");
      return;
    }

    const payload: Record<string, unknown> = {
      FIR_Date: form.FIR_Date,
      Victim_ID: Number(form.Victim_ID),
    };

    if (pendingNewCase) {
      payload.newCase = {
        Description: pendingNewCase.Description.trim(),
        Case_Date: pendingNewCase.Case_Date,
        Case_Status: pendingNewCase.Case_Status || "Open",
      };
    } else {
      payload.Case_ID = Number(form.Case_ID);
    }

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

  const handleAttachNewCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (caseForm.Description.trim().length < 5) {
      toast.error("Case name must be at least 5 characters");
      return;
    }
    if (!caseForm.Case_Date) {
      toast.error("Case date is required");
      return;
    }
    setPendingNewCase({
      Description: caseForm.Description.trim(),
      Case_Date: caseForm.Case_Date,
      Case_Status: caseForm.Case_Status || "Open",
    });
    setForm((prev) => ({ ...prev, Case_ID: "" }));
    setShowCaseModal(false);
    toast.success("New case ready — save the FIR to create it");
  };

  const handleDelete = (f: FIRItem) => {
    if (confirm("Delete this FIR? This action cannot be undone.")) {
      if (f.FIR_No) deleteMutation.mutate(f.FIR_No);
    }
  };

  const victimName = (item: FIRItem) =>
    item.Victim?.Victim_Name ||
    (typeof item.Victim_ID === "object" && item.Victim_ID?.Victim_Name) ||
    "—";

  const caseStatus = (item: FIRItem) =>
    item.Case?.Case_Status ||
    (typeof item.Case_ID === "object" && item.Case_ID?.Case_Status) ||
    "Unknown";

  const columns = [
    {
      header: "Filing Date",
      cell: (item: FIRItem) => (
        <span className="font-mono text-sm">
          {new Date(item.FIR_Date).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Victim",
      grow: true,
      cell: (item: FIRItem) => (
        <span className="font-semibold text-white">{victimName(item)}</span>
      ),
    },
    {
      header: "Linked Case",
      grow: true,
      cell: (item: FIRItem) => {
        const desc =
          item.Case?.Description ||
          (typeof item.Case_ID === "object" && item.Case_ID?.Description) ||
          null;
        return (
          <div className="min-w-0">
            <div className="truncate text-slate-200" title={desc || undefined}>
              {desc || "—"}
            </div>
            <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-700 bg-slate-800/80 text-slate-400">
              {caseStatus(item)}
            </span>
          </div>
        );
      },
    },
  ];

  const totalPages = firsData?.total ? Math.ceil(firsData.total / limit) : 0;

  return (
    <PageShell>
      <PageHeader
        title="FIR Records"
        subtitle="First Information Reports registry."
        onAdd={() => {
          setForm(emptyForm);
          setPendingNewCase(null);
          setShowModal(true);
        }}
        addButtonText="File FIR"
      />

      <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
        <span className="font-bold">Attention:</span> FIR records are immutable
        and cannot be edited once firmly filed in the system.
      </div>

      {isLoading ? (
        <div className="glass-dark rounded-2xl border border-slate-700/50 flex justify-center p-12 text-slate-400">
          Retrieving legal documents...
        </div>
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
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-semibold transition-all ${
                p === page
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white border border-slate-700/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── File FIR ── */}
      <CrudModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPendingNewCase(null);
        }}
        title="FIR Draft"
        isEditing={false}
        onSubmit={handleCreate}
        isSaving={createMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">
            Date of Filing *
          </label>
          <input
            type="date"
            value={form.FIR_Date}
            onChange={(e) =>
              setForm((f) => ({ ...f, FIR_Date: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>

        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-400">
              Select Victim *
            </label>
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
            onChange={(e) =>
              setForm((f) => ({ ...f, Victim_ID: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          >
            <option value="">Choose a victim profile</option>
            {victims?.map((v) => (
              <option key={v.Victim_ID} value={String(v.Victim_ID)}>
                {v.Victim_Name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-slate-400">
              Associated Case *
            </label>
            <button
              type="button"
              onClick={() => {
                setCaseForm(emptyCaseForm());
                setShowCaseModal(true);
              }}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              <FolderPlus className="h-3 w-3" /> New
            </button>
          </div>

          {pendingNewCase ? (
            <div className="w-full bg-blue-500/10 border border-blue-500/30 text-white rounded-xl px-4 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  New case (created on save)
                </p>
                <p className="font-medium truncate">{pendingNewCase.Description}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {pendingNewCase.Case_Status} ·{" "}
                  {new Date(pendingNewCase.Case_Date).toLocaleDateString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingNewCase(null)}
                className="text-xs text-slate-400 hover:text-red-400 shrink-0"
              >
                Clear
              </button>
            </div>
          ) : (
            <select
              value={form.Case_ID}
              onChange={(e) =>
                setForm((f) => ({ ...f, Case_ID: e.target.value }))
              }
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
              required={!pendingNewCase}
            >
              <option value="">Select linked case</option>
              {cases?.map((c) => (
                <option key={c.Case_ID} value={String(c.Case_ID)}>
                  {c.Description || `Case #${c.Case_ID}`} — {c.Case_Status}
                </option>
              ))}
            </select>
          )}
        </div>
      </CrudModal>

      {/* ── Register Victim ── */}
      <CrudModal
        isOpen={showVictimModal}
        onClose={() => setShowVictimModal(false)}
        title="Register Victim"
        isEditing={false}
        onSubmit={handleCreateVictim}
        isSaving={createVictimMutation.isPending}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">
            Victim Name *
          </label>
          <input
            value={victimForm.Victim_Name}
            onChange={(e) =>
              setVictimForm((v) => ({ ...v, Victim_Name: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Gender</label>
          <select
            value={victimForm.Gender}
            onChange={(e) =>
              setVictimForm((v) => ({
                ...v,
                Gender: e.target.value as NewVictimForm["Gender"],
              }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">
            Phone Number
          </label>
          <input
            value={victimForm.Phone}
            onChange={(e) =>
              setVictimForm((v) => ({ ...v, Phone: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          />
        </div>
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">Address</label>
          <textarea
            value={victimForm.Address}
            onChange={(e) =>
              setVictimForm((v) => ({ ...v, Address: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]"
          />
        </div>
      </CrudModal>

      {/* ── New Case (typed name) ── */}
      <CrudModal
        isOpen={showCaseModal}
        onClose={() => setShowCaseModal(false)}
        title="Case"
        isEditing={false}
        onSubmit={handleAttachNewCase}
        isSaving={false}
      >
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-medium text-slate-400">
            Case Name / Description *
          </label>
          <input
            value={caseForm.Description}
            onChange={(e) =>
              setCaseForm((c) => ({ ...c, Description: e.target.value }))
            }
            placeholder="e.g. Robbery at Central Market"
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
            minLength={5}
            autoFocus
          />
          <p className="text-xs text-slate-500">
            This creates a new case in the database when you save the FIR.
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">
            Case Date *
          </label>
          <input
            type="date"
            value={caseForm.Case_Date}
            onChange={(e) =>
              setCaseForm((c) => ({ ...c, Case_Date: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-400">Status</label>
          <select
            value={caseForm.Case_Status}
            onChange={(e) =>
              setCaseForm((c) => ({ ...c, Case_Status: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-3"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </CrudModal>
    </PageShell>
  );
}
