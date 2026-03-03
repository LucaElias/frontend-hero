import { useEffect } from 'react';
import { Shell } from './components/Shell';
import { SCENARIOS } from './data/scenarios';
import { useGameStore } from './store/useGameStore';
import type { Scenario } from './types/Scenario';

function App() {
  const { startScenario } = useGameStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticketBase64 = params.get('ticket');
    if (ticketBase64) {
      try {
        const decoded = decodeURIComponent(atob(ticketBase64));
        const scenario = JSON.parse(decoded) as Scenario;

        if (!SCENARIOS.find(s => s.id === scenario.id)) {
          SCENARIOS.push(scenario);
        }

        startScenario(scenario.id);
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (err) {
        console.error("Failed to parse custom ticket", err);
        alert("Das benutzerdefinierte Ticket konnte nicht geladen werden.");
      }
    }
  }, [startScenario]);

  return <Shell />;
}

export default App;
