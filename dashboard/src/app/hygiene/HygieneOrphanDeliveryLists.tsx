"use client";

import DataTable, { type Column } from "@/components/DataTable";
import InfoTooltip from "@/components/InfoTooltip";

interface OrphanDeliveryListRow {
  id: string;
  name: string;
  folder: string;
  url: string;
}

const columns: Column<OrphanDeliveryListRow>[] = [
  { key: "name", label: "Delivery-lijst", width: "45%" },
  { key: "folder", label: "Folder", width: "35%" },
  {
    key: "url",
    label: "",
    sortable: false,
    align: "right",
    render: (r) => (
      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange-500 hover:underline text-xs"
      >
        Open →
      </a>
    ),
  },
];

export default function HygieneOrphanDeliveryLists({
  rows,
  error,
}: {
  rows: OrphanDeliveryListRow[];
  error: string | null;
}) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Delivery-lijsten zonder overview-taak ({rows.length})
        </h2>
        <InfoTooltip text="Actieve lijsten in Delivery die niet gekoppeld zijn via het List-veld op een overview-taak (Projects of Estimates)." />
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
        </div>
      ) : (
        <DataTable
          data={rows}
          columns={columns}
          searchKeys={["name", "folder"]}
          defaultSort={{ key: "name", dir: "asc" }}
          emptyMessage="Alle actieve Delivery-lijsten hebben een overview-koppeling."
        />
      )}
    </section>
  );
}
