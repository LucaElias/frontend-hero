import type { Scenario } from '../types/Scenario';

export const SCENARIOS: Scenario[] = [
    {
        id: '1-invisible-button',
        title: 'Der unsichtbare Button',
        difficulty: 'Junior',
        briefing: {
            sender: 'Lisa aus dem Design',
            role: 'Frontend Retter',
            subject: 'WICHTIG: Button unlesbar!',
            message: `Hi,

wir haben ein Problem mit dem "Jetzt kaufen" Button.
Auf dem neuen hellgrauen Hintergrund ist die weiße Schrift kaum zu lesen. Es sieht aus, als wäre der Button "leer".

Kannst du dem Button bitte wieder eine kräftige Farbe geben? Am besten unser Brand-Blue (#2563EB).`,
            goals: ['Mache den Button sichtbar', 'Nutze die richtige Hintergrundfarbe', 'Sorge für genug Kontrast']
        },
        diagnosis: {
            question: 'Warum ist der Button nicht zu sehen?',
            options: [
                { id: 'opt1', text: 'Der Button ist opacity: 0', isCorrect: false, feedback: 'Nein, er ist da, nur weiß auf weiß.' },
                { id: 'opt2', text: 'Fehlende Hintergrundfarbe (Kontrast)', isCorrect: true, feedback: 'Korrekt! Weiße Schrift braucht dunklen Hintergrund.' },
                { id: 'opt3', text: 'Display ist none', isCorrect: false, feedback: 'Dann wäre er gar nicht im DOM.' },
            ]
        },
        solution: {
            initialHtml: `<div class="card">
  <h2>Unser Produkt</h2>
  <button class="cta-button">Jetzt kaufen</button>
</div>`,
            initialCss: `.card {
  padding: 20px;
  background: #e5e7eb; /* Hellgrau, damit man den weißen Button sieht */
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: sans-serif;
  text-align: center;
}

.cta-button {
  /* PROBLEM: Weiße Schrift auf (fast) weißem Grund? */
  color: white; 
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}`,
            requiredSelectors: ['.cta-button'],
            explanation: 'Buttons brauchen einen hohen Kontrast. Weiße Schrift auf weißem Grund ist ein klassischer Fehler. Mit `background-color` beheben wir das.',
            targetCssProperties: {
                '.cta-button': {
                    'background-color': '#2563eb' // simplified check
                }
            }
        },
        hints: [
            { title: 'Level 1: Google Suche', text: 'Suche nach "css button background contrast"' },
            { title: 'Level 2: KI-Prompt', text: 'Frag eine KI: "Warum ist weiße Schrift auf hellgrauem Grund schlecht und wie fix ich das mit CSS?"' },
            { title: 'Level 3: Spezifischer KI-Prompt', text: 'Frag: "Welche CSS Property ändert die Hintergrundfarbe eines Buttons? Gib mir ein Beispiel für Blau."' }
        ]
    },
    {
        id: '2-sticky-text',
        title: 'Der Klebe-Text',
        difficulty: 'Junior',
        briefing: {
            sender: 'Mark (Content)',
            role: 'Layout Polierer',
            subject: 'Box sieht "kaputt" aus',
            message: `Moin,

schau dir mal die Info-Box an. Der Text klebt förmlich am Rand. Das sieht extrem unprofessionell aus.
Der Kunde fragt, ob wir da "mehr Luft" reinmachen können.

VG, Mark`,
            goals: ['Füge Innenabstand (Padding) hinzu', 'Der Text darf den Rand nicht berühren']
        },
        diagnosis: {
            question: 'Welche Eigenschaft sorgt für "Luft" innerhalb einer Box?',
            options: [
                { id: 'opt1', text: 'margin', isCorrect: false, feedback: 'Margin ist der Außenabstand ZWISCHEN Boxen.' },
                { id: 'opt2', text: 'padding', isCorrect: true, feedback: 'Richtig! Padding ist der Innenabstand.' },
                { id: 'opt3', text: 'border', isCorrect: false, feedback: 'Border ist der Rahmen selbst.' },
            ]
        },
        solution: {
            initialHtml: `<div class="info-box">
  Dies ist ein wichtiger Hinweis, der leider viel zu nah am Rand klebt. Das ist schlecht für die Lesbarkeit.
</div>`,
            initialCss: `.info-box {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  color: #92400e;
  border-radius: 6px;
  /* HIER FEHLT PLATZ */
}`,
            requiredSelectors: ['.info-box'],
            explanation: '`padding` definiert den Abstand zwischen dem Inhalt und dem Rand (Border). Ohne Padding wirkt Text oft eingequetscht.',
        },
        hints: [
            { title: 'Level 1: Google Suche', text: 'Suche nach "css abstand innerhalb vs außerhalb"' },
            { title: 'Level 2: KI-Prompt', text: 'Frag eine KI: "Was ist der Unterschied zwischen margin und padding in CSS? Was nehme ich, um Text mehr Platz IM Container zu geben?"' },
            { title: 'Level 3: Spezifischer KI-Prompt', text: 'Frag: "Wie füge ich 20 Pixel Innenabstand zu einer Box mit der Klasse .info-box hinzu?"' }
        ]
    },
    {
        id: '3-broken-gallery',
        title: 'Die kaputte Galerie',
        difficulty: 'Mid',
        briefing: {
            sender: 'Tim (Dev Team)',
            role: 'Flexbox Expert',
            subject: 'Galerie stapelt sich :(',
            message: `Hey,

ich wollte eine Bildergalerie bauen, aber irgendwie sind die Bilder alle untereinander statt nebeneinander.
Ich habe `+ '`display: block`' + ` auf dem Container, aber das war wohl falsch oder?

Kannst du das fixen, damit sie schön in einer Reihe stehen?`,
            goals: ['Ordne die Bilder nebeneinander an', 'Nutze Flexbox']
        },
        diagnosis: {
            question: 'Wie ordnet man Elemente am besten nebeneinander an?',
            options: [
                { id: 'opt1', text: 'display: flex', isCorrect: true, feedback: 'Genau! Flexbox ist perfekt für eindimensionale Layouts.' },
                { id: 'opt2', text: 'float: left', isCorrect: false, feedback: 'Das haben wir 2010 gemacht. Heute nutzen wir Flexbox.' },
                { id: 'opt3', text: 'position: absolute', isCorrect: false, feedback: 'Zu unflexibel für eine Galerie.' },
            ]
        },
        solution: {
            initialHtml: `<div class="gallery">
  <div class="img-box">IMG 1</div>
  <div class="img-box">IMG 2</div>
  <div class="img-box">IMG 3</div>
</div>`,
            initialCss: `.gallery {
  /* HIER MUSS WAS GEÄNDERT WERDEN */
  display: block; 
  gap: 10px;
}

.img-box {
  width: 100px;
  height: 100px;
  background: #ddd;
  display: flex; /* Nur zum zentrieren des Textes */
  align-items: center;
  justify-content: center;
}`,
            requiredSelectors: ['.gallery'],
            explanation: '`display: flex` auf dem Elternelement sorgt dafür, dass die Kinder (Flex-Items) standardmäßig nebeneinander (in einer Zeile) angeordnet werden.',
        },
        hints: [
            { title: 'Level 1: Google Suche', text: 'Suche nach "css elemente nebeneinander flexbox"' },
            { title: 'Level 2: KI-Prompt', text: 'Frag eine KI: "Wie kriege ich mit CSS div-Elemente nebeneinander? Erkläre mir, was display: flex macht."' },
            { title: 'Level 3: Spezifischer KI-Prompt', text: 'Frag: "Gib mir den CSS Code, um Elemente in einem Container (.gallery) horizontal anzuordnen."' }
        ]
    }
];
