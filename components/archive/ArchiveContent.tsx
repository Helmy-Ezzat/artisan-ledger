import { getArchivedClients } from "@/app/actions/clients";
import { ArchiveClient } from "./ArchiveClient";

export async function ArchiveContent() {
  const archivedClients = await getArchivedClients();

  if (archivedClients.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-slate-500">لا يوجد عملاء مؤرشفون.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600 px-1">
        عدد العملاء المؤرشفون: <span className="font-bold">{archivedClients.length}</span>
      </p>
      
      <div className="space-y-3">
        {archivedClients.map((client) => (
          <ArchiveClient key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}
