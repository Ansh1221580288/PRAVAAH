import { useState } from "react";
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import RiskMap from "./components/RiskMap";
import PrioritySectors from "./components/PrioritySectors";
import SOSReports from "./components/SOSReports";
import BlockedRoads from "./components/BlockedRoads";
import ResourceAllocation from "./components/ResourceAllocation";
import SituationMonitoring from "./components/SituationMonitoring";
import { disasterData } from "./data/mockData";


function App() {
  const [mode, setMode] = useState("normal");

  const data = disasterData[mode];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header mode={mode} setMode={setMode} />

      <main className="mx-auto max-w-[1600px] space-y-6 p-6">

        {/* Dashboard title */}
        <div>
          <p className="text-sm font-medium text-cyan-400">
            DISASTER OPERATIONS
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Situation Overview
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Real-time disaster intelligence and response monitoring
          </p>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <StatCard
            title="Flood Risk"
            value={`${Math.round(data.riskScore * 100)}%`}
            subtitle={data.risk}
            icon="🌊"
          />

          <StatCard
            title="Population Exposed"
            value={data.population.toLocaleString()}
            subtitle="People potentially affected"
            icon="👥"
          />

          <StatCard
            title="Critical Sectors"
            value={data.criticalSectors}
            subtitle="Priority sectors"
            icon="⚠️"
          />

          <StatCard
            title="SOS Reports"
            value={data.sos}
            subtitle="Active emergency reports"
            icon="🚨"
          />

          <StatCard
            title="Blocked Roads"
            value={data.blockedRoads}
            subtitle="Routes requiring attention"
            icon="🚧"
          />

        </section>

        {/* Map */}
        <RiskMap mode={mode} />

{/* Operations */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">  
          <PrioritySectors sectors={data.sectors} />
          <SOSReports reports={data.sosReports} />
        </div>

{/* Infrastructure */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BlockedRoads roads={data.roads} />
          <ResourceAllocation resources={data.resources} />
        </div>

{/* Situation */}
        <SituationMonitoring data={data} />
      </main>
    </div>
  );
}

export default App;