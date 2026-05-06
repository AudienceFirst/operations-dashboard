import { loadCache } from "@/lib/data";
import MetricCard from "@/components/MetricCard";
import HygieneProjectList from "./HygieneProjectList";
import GrippSection from "./GrippSection";
import HygieneOrphanDeliveryLists from "./HygieneOrphanDeliveryLists";
import { TEAM_ID, getFolders, getLists } from "@/lib/clickup";

export const dynamic = "force-dynamic";

interface OrphanDeliveryListRow {
  id: string;
  name: string;
  folder: string;
  url: string;
}

export default async function HygienePage() {
  const cache = loadCache();
  if (!cache) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">Geen data beschikbaar</p>
          <p className="text-sm text-gray-500 mt-1">
            Draai <code className="bg-gray-200 px-1.5 py-0.5 rounded">node sync.mjs</code>
          </p>
        </div>
      </div>
    );
  }

  const projects = cache.projects.filter((p) => p.taskCount > 0);
  const nonContainerTasks = projects.flatMap((p) => p.tasks.filter((t) => !t.isContainer));
  const noAssignee = nonContainerTasks.filter((t) => t.issues.includes("no_assignee"));
  const noEstimate = nonContainerTasks.filter((t) => t.issues.includes("no_estimate"));
  const missingDates = nonContainerTasks.filter(
    (t) => t.issues.includes("no_start_date") || t.issues.includes("no_due_date")
  );
  const containerHours = projects.flatMap((p) =>
    p.tasks.filter((t) => t.hoursOnContainer > 0).map((t) => ({ ...t, projectName: p.name, pm: p.pm }))
  );
  const totalContainerHours = containerHours.reduce((s, t) => s + t.hoursOnContainer, 0);
  const overviewListIds = new Set(
    [...cache.projects, ...cache.estimates]
      .map((item) => item.listId)
      .filter((id): id is string => Boolean(id))
  );

  let orphanDeliveryLists: OrphanDeliveryListRow[] = [];
  let orphanDeliveryListsError: string | null = null;
  const deliverySpaceId = cache.spaces.delivery;

  if (deliverySpaceId) {
    try {
      const folders = await getFolders(deliverySpaceId, false);
      const listsPerFolder = await Promise.all(
        folders.map(async (folder) => {
          const lists = await getLists(folder.id, false);
          return lists.map((list) => ({
            id: list.id,
            name: list.name,
            folder: folder.name,
            url: `https://app.clickup.com/${TEAM_ID}/v/li/${list.id}`,
          }));
        })
      );

      orphanDeliveryLists = listsPerFolder
        .flat()
        .filter((list) => !overviewListIds.has(list.id))
        .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));
    } catch {
      orphanDeliveryListsError = "Kon Delivery-lijsten niet laden om te matchen met overview-taken.";
    }
  } else {
    orphanDeliveryListsError = "Delivery space ontbreekt in cache, daardoor kunnen unmatched lijsten niet bepaald worden.";
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Hygiëne Dashboard</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Alleen taken met task type &quot;Task&quot; (geen containers). Per project uit te klappen naar individuele taken.
      </p>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard label="Zonder assignee" value={noAssignee.length} />
        <MetricCard label="Zonder uren-schatting" value={noEstimate.length} />
        <MetricCard label="Zonder start/due date" value={missingDates.length} />
        <MetricCard label="Uren op containers" value={containerHours.length} sub={`${totalContainerHours.toFixed(1)} u totaal`} />
      </div>

      <GrippSection />

      <div className="mt-6">
        <HygieneOrphanDeliveryLists rows={orphanDeliveryLists} error={orphanDeliveryListsError} />
      </div>

      <HygieneProjectList projects={projects} />
    </div>
  );
}
