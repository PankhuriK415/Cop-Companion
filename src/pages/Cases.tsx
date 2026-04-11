export default function Cases() {
  const cases = [
    {
      id: 1,
      number: "2024-001",
      title: "Smith v. Johnson",
      status: "In Progress",
      date: "2024-03-15",
    },
    {
      id: 2,
      number: "2024-002",
      title: "State v. Williams",
      status: "Open",
      date: "2024-03-10",
    },
    {
      id: 3,
      number: "2024-003",
      title: "Brown v. Davis",
      status: "Closed",
      date: "2024-02-20",
    },
    {
      id: 4,
      number: "2024-004",
      title: "Miller v. Wilson",
      status: "Open",
      date: "2024-03-05",
    },
    {
      id: 5,
      number: "2024-005",
      title: "Taylor v. Anderson",
      status: "Pending Review",
      date: "2024-03-01",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Cases</h1>
        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
          + New Case
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="px-6 py-4 text-left text-slate-300 font-semibold">
                Case #
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-semibold">
                Title
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-semibold">
                Status
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-semibold">
                Date Created
              </th>
              <th className="px-6 py-4 text-left text-slate-300 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {cases.map((caseItem) => (
              <tr key={caseItem.id} className="hover:bg-slate-700 transition">
                <td className="px-6 py-4 text-white font-mono">
                  {caseItem.number}
                </td>
                <td className="px-6 py-4 text-slate-300">{caseItem.title}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      caseItem.status === "Open"
                        ? "bg-blue-900 text-blue-200"
                        : caseItem.status === "In Progress"
                          ? "bg-yellow-900 text-yellow-200"
                          : caseItem.status === "Closed"
                            ? "bg-green-900 text-green-200"
                            : "bg-purple-900 text-purple-200"
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{caseItem.date}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-400 hover:text-blue-300 font-semibold text-sm">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
