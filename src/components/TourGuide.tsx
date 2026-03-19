import React, { useEffect, useState } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import type { CallBackProps, Step } from 'react-joyride';
import { useGameStore } from '../store/useGameStore';

export const TourGuide: React.FC = () => {
    const { setHasSeenTutorial, currentScenarioId, setPhase, studentName, hasSeenTutorial } = useGameStore();
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Run tutorial if it's the tutorial scenario, the student is logged in, and hasn't seen it
        if (currentScenarioId === '0-tutorial' && studentName && !hasSeenTutorial) {
            setRun(true);
        } else {
            setRun(false);
        }
    }, [currentScenarioId, studentName, hasSeenTutorial]);

    const steps: Step[] = [
        {
            target: 'body',
            content: 'Willkommen bei Frontend Hero! Dies ist eine Simulations-Umgebung, in der du lernst, wie man echte Frontend-Probleme löst.',
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '#tour-tickets-list',
            content: 'Ganz links findest du deine "Tickets" (Aufgaben). Jedes Ticket repräsentiert eine Störungsmeldung von einem Kollegen oder Kunden. Du musst sie nacheinander abarbeiten.',
            placement: 'right',
        },
        {
            target: '#tour-briefing-tab',
            content: 'Schritt 1: Posteingang. Hier liest du die Fehlerbeschreibung. Verstehe das Problem, bevor du handelst.',
            placement: 'top',
        },
        {
            target: 'button[style*="background-color: rgb(0, 0, 0)"]', // Problemanalyse starten button
            content: 'Klicke am Ende der Mail immer auf "Problemanalyse starten", um zum nächsten Schritt zu gelangen.',
            placement: 'top',
        },
        {
            target: '#tour-diagnosis-tab',
            content: '2. Analyse: Bevor du codest, musst du verstehen, was falsch läuft. Wähle die richtige Antwort aus, um den Workspace freizuschalten.',
            placement: 'bottom',
        },
        {
            target: '#tour-workbench-tab',
            content: '3. Workspace: Hier findet die eigentliche Arbeit statt. Korrigiere den CSS-Code und klicke oben rechts auf "EINGABE PRÜFEN".',
            placement: 'bottom',
        }
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, index, action } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            setHasSeenTutorial(true);
        }

        // Logic to switch tabs automatically during the tour
        if (action === 'next' || action === 'prev') {
            if (index < 4) {
                setPhase('briefing');
            } else if (index === 4) {
                setPhase('diagnosis');
            } else if (index === 5) {
                setPhase('workbench');
            }
        }
    };

    return (
        <Joyride
            callback={handleJoyrideCallback}
            continuous
            hideCloseButton
            run={run}
            scrollToFirstStep
            showSkipButton
            steps={steps}
            styles={{
                options: {
                    primaryColor: '#4f46e5',
                    zIndex: 1000,
                },
                buttonNext: {
                    backgroundColor: '#4338ca',
                }
            }}
            locale={{
                back: 'Zurück',
                close: 'Schließen',
                last: 'Verstanden!',
                next: 'Weiter',
                skip: 'Überspringen',
            }}
        />
    );
};
