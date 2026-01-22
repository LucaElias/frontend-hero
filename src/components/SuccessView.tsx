import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, Award } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const SuccessView: React.FC = () => {
    const { nextScenario } = useGameStore();

    useEffect(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full bg-indigo-600 text-white">
            <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm text-center max-w-lg animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-900 shadow-xl">
                    <Award className="w-10 h-10" />
                </div>

                <h2 className="text-4xl font-bold mb-4">Fantastisch!</h2>
                <p className="text-indigo-100 text-lg mb-8">
                    Du hast das Problem gelöst und den Bug gefixt. Der Kunde ist happy!
                </p>

                <button
                    onClick={nextScenario}
                    className="group bg-white text-indigo-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center gap-2 mx-auto"
                >
                    Nächstes Ticket <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
