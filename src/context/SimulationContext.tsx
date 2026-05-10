import { createContext, useContext, useState } from "react";

interface SimulationContextType {
  simulationMode: boolean;
  setSimulationMode: (v: boolean) => void;
}

const SimulationContext = createContext<SimulationContextType>({
  simulationMode: true,
  setSimulationMode: () => {},
});

export function SimulationProvider({
  children,
}: { children: React.ReactNode }) {
  const [simulationMode, setSimulationMode] = useState(true);
  return (
    <SimulationContext.Provider value={{ simulationMode, setSimulationMode }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => useContext(SimulationContext);
