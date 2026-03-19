import type { Scenario } from '../types/Scenario';

export const SCENARIOS: Scenario[] = [
    {
        id: '0-tutorial',
        title: 'Willkommen (Tutorial)',
        difficulty: 'Tutorial',
        briefing: {
            sender: 'Dein Mentor (Alex)',
            role: 'Junior Frontend Dev',
            subject: 'Dein erster Tag: So funktioniert das Tool',
            message: `Hallo! Schön, dass du da bist. In Frontend Hero lernst du, Fehler im Code zu finden und zu beheben.

Jedes Ticket hat drei Schritte:
1. "Posteingang" (hier): Lies die Anforderungen.
2. "Analyse": Beantworte eine Fachfrage zum Problem.
3. "Workspace": Schreibe den CSS-Code und prüfe ihn.

Deine erste Aufgabe:
Beantworte gleich die Frage in der Analyse. Gehe danach in den Workspace und ändere im Editor die Eigenschaft 'background-color' der '.test-box' von '#ddd' zu 'red'. Klicke dann oben rechts auf 'EINGABE PRÜFEN'.`,
            goals: ['Starte die Analyse unten', 'Wähle in der Analyse "color"', 'Setze im Workspace background-color: red']
        },
        diagnosis: {
            question: 'Schritt 2 (Analyse): Mit welcher CSS-Eigenschaft ändert man die Schrifffarbe (nicht den Hintergrund)?',
            options: [
                { id: 'opt1', text: 'background-color', isCorrect: false, feedback: 'Knapp daneben! Das ist für den Hintergrund. Wir suchen die Textfarbe.' },
                { id: 'opt2', text: 'color', isCorrect: true, feedback: 'Genau! "color" ist für Text. Jetzt schalten wir den Workspace für dich frei!' },
                { id: 'opt3', text: 'font-style', isCorrect: false, feedback: 'Nein, das ist für kursive Schrift (italic).' },
            ]
        },
        solution: {
            initialHtml: `<div class="test-box">
  Dies ist ein Test-Text
</div>`,
            initialCss: `.test-box {
  width: 250px;
  height: 120px;
  background-color: #ddd; /* Ändere #ddd zu red */
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  border-radius: 8px;
}`,
            requiredSelectors: ['.test-box'],
            explanation: 'Perfekt! Du hast den Ablauf verstanden. Jetzt kommen echte Aufgaben von Kunden.',
            targetCssProperties: {
                '.test-box': {
                    'background-color': 'red'
                }
            }
        },
        hints: [
            { level: 1, title: 'Dein Ziel', text: 'Suche im Code-Editor nach der Eigenschaft, die für die Hintergrundfarbe ("background-color") zuständig ist.' },
            { level: 2, title: 'Immer noch unsicher?', text: 'Im rechten Fenster siehst du den Code. Gehe in Zeile 4 und tippe dort "red" rein.' },
            { level: 3, title: 'Lösung', text: 'Ändere Zeile 4 zu: background-color: red;' }
        ]
    },
    {
        id: '1-box-model',
        title: 'Ticket #1: Die übergewichtige Box',
        difficulty: 'Junior',
        briefing: {
            sender: 'Marketing Team',
            role: 'Junior Frontend Dev',
            subject: 'Banner bricht aus dem Container',
            message: `Hi,

ich habe gerade unser neues Werbebanner für die Startseite gebaut. Der äußere Container hat genau 320px Breite, und das Banner darin soll auch genau 100% dieser Breite einnehmen.

Ich habe dem Banner etwas Padding (20px) gegeben, damit der Text nicht so am Rand klebt, und einen schönen dicken Rand (10px solid black).

Jetzt ist das Banner plötzlich viel breiter als 320px und ragt rechts aus dem grauen Container heraus! Warum passiert das? Kannst du das reparieren, ohne das Padding oder den Border zu entfernen?`,
            goals: ['Finde heraus, warum das Banner zu breit ist', 'Korrigiere das Verhalten, sodass Padding und Border in die 100% Breite MIT eingerechnet werden', 'Behalte padding und border unbedingt bei']
        },
        diagnosis: {
            question: 'Warum ragt das Element aus seinem Eltern-Container, obwohl es width: 100% hat?',
            options: [
                { id: 'opt1', text: 'Das Standard-Box-Modell (content-box) addiert Padding und Border zur definierten Breite hinzu.', isCorrect: true, feedback: 'Exakt! 100% Breite (320px) + 40px Padding + 20px Border = 380px. Das ist zu breit für den Container!' },
                { id: 'opt2', text: 'Weil der Eltern-Container display: block hat.', isCorrect: false, feedback: 'Nein, display: block ist das normale Standardverhalten eines divs und erbt die volle Breite.' },
                { id: 'opt3', text: 'Man darf 100% niemals mit Pixel-Werten mischen.', isCorrect: false, feedback: 'Das ist ein Mythos. Mit dem richtigen Box-Model ist das gar kein Problem.' },
            ]
        },
        solution: {
            initialHtml: `<div class="container">
  <div class="banner">
    <h2>Special Sale</h2>
    <p>Nur für kurze Zeit!</p>
  </div>
</div>`,
            initialCss: `.container {
  width: 320px;
  background-color: #f1f5f9;
  border: 4px dashed #94a3b8; /* Sichtbare Grenze des Containers */
  margin: 0 auto;
}

.banner {
  width: 100%;
  background-color: #fef08a;
  padding: 20px;
  border: 10px solid black;
  
  /* Dein Fix hier unten: */
  
}`,
            requiredSelectors: ['.banner'],
            explanation: 'Durch `box-sizing: border-box;` zwingst du den Browser, Padding und Border in die angegebene Breite (100%) mit einzurechnen. Die Box wächst also nach "innen" statt nach außen. Das ist einer der wichtigsten CSS-Tricks überhaupt!',
            targetCssProperties: {
                '.banner': {
                    'box-sizing': 'border-box'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google mal nach "CSS Box Model padding width problem" oder lies dir auf MDN den Artikel zu "box-sizing" durch.' },
            { level: 2, title: 'KI-Prompt', text: 'Frag ein KI-Sprachmodell deiner Wahl: "Warum wird mein CSS Div größer als 100% Breite, sobald ich padding und border hinzufüge? Welche CSS Eigenschaft behebt das?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Da ist der Hebel: Standardmäßig nutzt CSS "box-sizing: content-box". Ändere dies bei `.banner` zu "box-sizing: border-box;", damit Padding und Border in die 100% Width gezwängt werden.' }
        ]
    },
    {
        id: '2-document-flow',
        title: 'Ticket #2: Die gestapelten Buttons',
        difficulty: 'Junior',
        briefing: {
            sender: 'Produktdesign',
            role: 'Junior Frontend Dev',
            subject: 'Buttons stehen untereinander statt nebeneinander',
            message: `Hey,

ich baue gerade an unserer neuen Toolbar. Es gibt drei einfache Buttons. Ich dachte, wenn ich jedem eine feste Breite von 100px gebe, passen sie wunderbar nebeneinander in unseren 400px breiten Container.

Aber aus irgendeinem Grund stapeln sie sich stur untereinander! 

Könntest du das fixen? Sie sollen nebeneinander stehen. Nutze dafür am besten den modernen Weg über den Vater-Container, nicht über die Elemente selbst.`,
            goals: ['Verstehe den Unterschied zwischen Block- und Inline-Elementen', 'Platziere die Elemente mithilfe einer modernen Layout-Technik nebeneinander', 'Ändere den Code im .toolbar-Container']
        },
        diagnosis: {
            question: 'Warum ordnen sich <div> Elemente standardmäßig UNTEREINANDER an?',
            options: [
                { id: 'opt1', text: 'Weil sie eine Hintergrundfarbe haben und sich gegenseitig abstoßen.', isCorrect: false, feedback: 'Die Farbe hat keine Auswirkung auf die Positionierung.' },
                { id: 'opt2', text: 'Weil divs standardmäßig "display: inline" haben.', isCorrect: false, feedback: 'Falsch. Wären sie "inline", würden sie nebeneinander fließen (wie Fließtext).' },
                { id: 'opt3', text: 'Weil divs sogenannte "Block"-Elemente sind und immer die volle Breite (100%) der Zeile beanspruchen.', isCorrect: true, feedback: 'Korrekt! Block-Elemente beanspruchen eine eigene Zeile für sich allein.' },
            ]
        },
        solution: {
            initialHtml: `<div class="toolbar">
  <div class="tool-btn">Tool 1</div>
  <div class="tool-btn">Tool 2</div>
  <div class="tool-btn">Tool 3</div>
</div>`,
            initialCss: `/* Container für die Toolbar */
.toolbar {
  width: 400px;
  background-color: #ddd;
  padding: 10px;
  
  /* Dein Fix hier: */

}

/* Die Buttons (nicht ändern) */
.tool-btn {
  width: 100px;
  background-color: #3b82f6;
  color: white;
  padding: 10px;
  text-align: center;
  border-radius: 4px;
}`,
            requiredSelectors: ['.toolbar'],
            explanation: 'Mit `display: flex;` machst du den `.toolbar` Container zu einem "Flex Container". Seine direkten Kinder (die Buttons) werden zu "Flex Items" und legen sich standardmäßig in eine horizontale Reihe. Das ist der modernste und sicherste Weg für solche Layouts!',
            targetCssProperties: {
                '.toolbar': {
                    'display': 'flex'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google mal nach "CSS elements side by side modern way" oder suche auf MDN/CSS-Tricks nach einem "A Complete Guide to Flexbox".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag ein KI-Sprachmodell deiner Wahl: "Wie zunge ich mehrere Block-Elemente in CSS elegant nebeneinander, indem ich dem gemeinsamen Eltern-Element EINE spezielle \'display\' Eigenschaft gebe?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Der moderne Hebel ist Flexbox. Füge der `.toolbar` Klasse (dem Eltern-Element) einfach `display: flex;` hinzu. Du brauchst die `.tool-btn` Klassen gar nicht anfassen!' }
        ]
    },
    {
        id: '3-positioning',
        title: 'Ticket #3: Das verrutschte "NEW" Badge',
        difficulty: 'Junior',
        briefing: {
            sender: 'Marketing Team',
            role: 'Junior Frontend Dev',
            subject: 'Badge zerstört das Layout der Produktkarte',
            message: `Hi,

ich versuche, ein kleines "NEW" Badge an die obere rechte Ecke unserer Produktkarte zu heften.
Leider nimmt das Badge aktuell Platz im normalen Dokumentenfluss ein ("Document Flow") und schiebt dadurch alle anderen Inhalte der Karte nach unten.

Kannst du das Badge so einstellen, dass es quasi über der Karte schwebt und exakt rechts oben an der Ecke klebt, ohne den Rest zu verschieben?

Du musst dafür sowohl die Karte als auch das Badge anfassen. Nutze "position".`,
            goals: ['Nimm das Badge aus dem normalen Dokumentenfluss', 'Positioniere es relativ zur Produktkarte', 'Bewege es an die Position top: 10px, right: 10px']
        },
        diagnosis: {
            question: 'Wie befestigt man ein Element "schwebend" an der Ecke seines direkten Elternelementes?',
            options: [
                { id: 'opt1', text: 'Das Elternteil bekommt position: absolute; das Kind position: relative.', isCorrect: false, feedback: 'Genau andersherum! Das Elternelement muss der Anker (relative) sein.' },
                { id: 'opt2', text: 'Das Elternteil bekommt position: relative; das Kind position: absolute.', isCorrect: true, feedback: 'Richtig! Das Elternelement wird zum Ankerpunkt für das absolut positionierte Kind.' },
                { id: 'opt3', text: 'Beide bekommen position: fixed.', isCorrect: false, feedback: 'Fixed verankert Elemente am Bildschirmfenster (Viewport), nicht am Elternelement. Sie würden beim Scrollen mitwandern.' },
            ]
        },
        solution: {
            initialHtml: `<div class="product-card">
  <div class="badge">NEW</div>
  <div class="product-image">👟</div>
  <h3>Super Sneaker</h3>
</div>`,
            initialCss: `.product-card {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  
  /* Mach mich zum Ankerpunkt: */
  
}

.product-image {
  font-size: 80px;
  background: #f1f5f9;
  border-radius: 8px;
  margin-bottom: 20px;
}

.badge {
  background-color: #ef4444; /* Rot */
  color: white;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: bold;
  border-radius: 4px;
  
  /* Nimm mich aus dem Fluss und setze mich nach oben rechts: */
  
}`,
            requiredSelectors: ['.product-card', '.badge'],
            explanation: 'Mit `position: relative;` beim Eltern-Element wird dieses zum Koordinaten-Ursprung. Mit `position: absolute;` beim Kind verlässt dieses den normalen Dokumentenfluss und kann mit Werten wie `top` und `right` Millimeter-genau innerhalb des Eltern-Elements platziert werden.',
            targetCssProperties: {
                '.product-card': {
                    'position': 'relative'
                },
                '.badge': {
                    'position': 'absolute',
                    'top': '10px',
                    'right': '10px'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Schau dir bei MDN oder W3Schools das Thema "CSS Position absolute inside relative" an.' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie positioniere ich in CSS ein Child-Element absolut in der oberen rechten Ecke eines Parent-Elements, damit es Platz überlappt, anstatt ihn zu verdrängen?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Gib `.product-card` die Eigenschaft `position: relative;`. Gib der `.badge` die Eigenschaften `position: absolute;`, `top: 10px;` und `right: 10px;`.' }
        ]
    },
    {
        id: '4-pseudo-classes',
        title: 'Ticket #4: Der holprige Button (Transitions)',
        difficulty: 'Junior',
        briefing: {
            sender: 'Lead Designerin',
            role: 'Junior Frontend Dev',
            subject: 'Hover-Effekt wirkt zu aggressiv',
            message: `Hey,

ich habe mir gerade den neuen "Anmelden" Button angesehen. Die Hover-Farbe (beim Drüberfahren mit der Maus) ist super, aber der Farbwechsel passiert hart und wirkt auf dem Auge wie ein Fehler.

Ich hätte gerne, dass die Hintergrundfarbe weich und elegant "überblendet" (eine Viertelsekunde Dauer).

Außerdem wäre es toll, wenn der Button noch eine leichte :active (Klick) Animation hätte (z.B. minimal verkleinert wirken). Gibst du dem Button den letzten Feinschliff?`,
            goals: ['Füge einen sauberen CSS-Übergang hinzu', 'Nutze :hover für die Farbe', 'Nutze :active für Klick-Feedback']
        },
        diagnosis: {
            question: 'Wo platziert man in CSS korrekterweise die Eigenschaft "transition: all 0.3s ease;" ?',
            options: [
                { id: 'opt1', text: 'Nur im :hover Status.', isCorrect: false, feedback: 'Falsch. Dann animiert das Element zwar beim Reinfahren der Maus, aber beim Verlassen "springt" es hart zurück.' },
                { id: 'opt2', text: 'Immer in der Hauptklasse des Elements (dem Base-State).', isCorrect: true, feedback: 'Richtig! Die Main-Klasse bestimmt das grundsätzliche Animations-Verhalten für Hin- UND Rückweg.' },
                { id: 'opt3', text: 'In einer @keyframes Animation.', isCorrect: false, feedback: 'Keyframes sind für komplexe, mehrstufige Endlos-Animationen, nicht für einfache A-zu-B Hover-Effekte.' },
            ]
        },
        solution: {
            initialHtml: `<div class="login-box">
  <button class="btn-login">Sicher Anmelden</button>
</div>`,
            initialCss: `.login-box {
  padding: 40px; text-align: center;
}

.btn-login {
  background-color: #3b82f6; /* Start: Blau */
  color: white;
  padding: 15px 30px;
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  /* 1. Weicher Übergang hier: */
  
}

/* 2. Hover Status: Mache ihn dunkler (#1d4ed8) */
.btn-login:hover {
  
}

/* 3. Active Status (beim Klicken): Mache ihn etwas kleiner (scale: 0.95) */
.btn-login:active {
  
}`,
            requiredSelectors: ['.btn-login', '.btn-login:hover', '.btn-login:active'],
            explanation: 'Mit `transition: 0.25s ease;` im Basis-Selektor aktivierst du Hardware-beschleunigte Überblendungen. `:hover` löst die Veränderung aus, und `:active` mit `transform: scale(0.95)` gibt haptisches Feedback beim Klicken.',
            targetCssProperties: {
                '.btn-login': {
                    'transition': '0.25s ease'
                },
                '.btn-login:hover': {
                    'background-color': '#1d4ed8'
                },
                '.btn-login:active': {
                    'transform': 'scale(0.95)'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google nach "CSS hover transition example" und "CSS transform scale on click".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie erstelle ich einen weichen Hover-Übergang für einen Button und wie mache ich ihn bei Mauklick (active) mit transform: scale optisch etwas kleiner?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: '1. In .btn-login: `transition: all 0.25s ease;` 2. In .btn-login:hover: `background-color: #1d4ed8;` 3. In .btn-login:active: `transform: scale(0.95);`' }
        ]
    },
    {
        id: '5-specificity',
        title: 'Ticket #5: Das störrische Rot (Spezifität)',
        difficulty: 'Mid',
        briefing: {
            sender: 'Lead Developer',
            role: 'Junior Frontend Dev',
            subject: 'WICHTIG: KEIN !important benutzen',
            message: `Hallo,

unser neues Kampagnen-Layout hat einen Premium-Button, der zwingend GRÜN (#10b981) sein muss.
Ich habe dem Button die Klasse \`.btn-premium\` gegeben und im CSS auf grün gesetzt.

Leider existiert ganz unten in einer uralten CSS-Datei ein fieser, zu genauer Selektor (\`div.content a.btn\`), der den Button stur rot färbt.

Deine Aufgabe:
Mache deinen Selektor \`.btn-premium\` mächtiger/spezifischer als den alten Selektor, damit der Button grün wird.
Das absolute No-Go: Du darfst NICHT \`!important\` benutzen. Das führt auf lange Sicht ins Chaos.

Schaffst du es, den Selektor geschickt zu erweitern?`,
            goals: ['Färbe den Button grün (#10b981)', 'Verwende NICHT !important', 'Gewinne den "Spezifitäts-Krieg" durch einen genaueren Selektor']
        },
        diagnosis: {
            question: 'Wie berechnet CSS, welche Regel "gewinnt" (Spezifität)?',
            options: [
                { id: 'opt1', text: 'Wer weiter oben in der CSS Datei steht, gewinnt immer.', isCorrect: false, feedback: 'Im Gegenteil: Bei gleicher Spezifität gewinnt der Code, der weiter UNTEN steht (Kaskade).' },
                { id: 'opt2', text: 'IDs sind viel mehr wert als Klassen. Klassen sind mehr wert als HTML-Tags (wie div oder a).', isCorrect: true, feedback: 'Exakt! Das ist das Punktesystem der CSS Spezifität. Eine ID schlägt dutzende Klassen.' },
                { id: 'opt3', text: 'Klassen schlagen immer IDs.', isCorrect: false, feedback: 'Falsch. IDs sind das "stärkste" Mittel (außer !important) in CSS.' },
            ]
        },
        solution: {
            initialHtml: `<div class="content" id="main-content">
  <h2>Premium Upgrade</h2>
  <a href="#" class="btn btn-premium">Jetzt upgraden</a>
</div>`,
            initialCss: `/* DEIN CODE: Mach den Selektor stärker! */
.btn-premium {
  background-color: #10b981; /* Grün, wie gewollt */
}













/* --- ALTE LEGACY DATEI (Nicht veränderbar!) --- */
div.content a.btn {
  background-color: #ef4444; /* Rot, das nervt */
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  display: inline-block;
  font-family: sans-serif;
  font-weight: bold;
}`,
            requiredSelectors: ['#main-content .btn-premium'],
            explanation: 'Spezifität ist wie ein Punktesystem. Eine ID schlägt hunderte Klassen. Indem du die ID des Containers (#main-content) am Anfang deines Selektors ergänzt hast, hast du gewonnen.',
            targetCssProperties: {
                '#main-content .btn-premium': {
                    'background-color': '#10b981'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google mal nach "CSS Specificity Calculator" oder lies dir durch, welche "Punktewerte" IDs, Klassen und Tags haben.' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie überschreibe ich in CSS einen starken Selektor wie \'div.content a.btn\', ohne !important zu benutzen?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Eine ID ist stärker als jede Klasse. Der Container hat die ID "main-content". Erweitere deinen Selektor zu "#main-content .btn-premium".' }
        ]
    },
    {
        id: '6-flexbox-basics',
        title: 'Ticket #6: Chaos in der Navigation',
        difficulty: 'Mid',
        briefing: {
            sender: 'UI/UX Department',
            role: 'Junior Frontend Dev',
            subject: 'Menüpunkte wild durcheinander',
            message: `Hey!

Einer unserer Praktikanten hat versucht, die neue Haupt-Navigation (\`.nav-menu\`) zu bauen.
Aktuell kleben alle 4 Links unstrukturiert aneinander.

Die Design-Anforderung lautet:
Die Links sollen elegant nebeneinander liegen. Der Platz im Container soll gleichmäßig ZWISCHEN den Elementen aufgeteilt werden. Außerdem müssen sie vertikal exakt mittig ausgerichtet sein.`,
            goals: ['Mache den Container zur Flexbox', 'Verteile den Platz gleichmäßig ZWISCHEN den Elementen', 'Zentriere die Elemente vertikal']
        },
        diagnosis: {
            question: 'Mit welcher Flexbox-Eigenschaft verteilt man den Platz so, dass das erste Element ganz links und das letzte ganz rechts klebt?',
            options: [
                { id: 'opt1', text: 'justify-content: center;', isCorrect: false, feedback: 'Dann würden alle Elemente zusammengepfercht in der Mitte kleben.' },
                { id: 'opt2', text: 'justify-content: space-between;', isCorrect: true, feedback: 'Perfekt! "Space-between" drückt die äußeren Elemente an die Ränder.' },
                { id: 'opt3', text: 'align-items: stretch;', isCorrect: false, feedback: 'Align-items kümmert sich um die Quer-Achse, nicht um die horizontale Platzverteilung.' },
            ]
        },
        solution: {
            initialHtml: `<nav class="nav-menu">
  <a href="#">Home</a>
  <a href="#">Produkte</a>
  <a href="#">Über uns</a>
  <a href="#">Kontakt</a>
</nav>`,
            initialCss: `.nav-menu {
  background-color: #1e293b;
  height: 80px;
  padding: 0 30px;
  
  /* Dein Flexbox-Zauber hier: */
  
}

.nav-menu a {
  color: white;
  text-decoration: none;
  font-family: sans-serif;
  font-weight: bold;
  padding: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
}`,
            requiredSelectors: ['.nav-menu'],
            explanation: '`display: flex;` legt die Elemente nebeneinander. `justify-content: space-between;` verteilt den horizontalen Platz, und `align-items: center;` sorgt für die vertikale Zentrierung.',
            targetCssProperties: {
                '.nav-menu': {
                    'display': 'flex',
                    'justify-content': 'space-between',
                    'align-items': 'center'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Schau dir "A Complete Guide to Flexbox" auf CSS-Tricks.com an.' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie zentriere ich in CSS Flexbox Elemente vertikal und wie verteile ich sie horizontal absolut gleichmäßig mit maximalem Abstand ZWISCHEN ihnen?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Du brauchst im `.nav-menu`: `display: flex;`, `justify-content: space-between;` und `align-items: center;`.' }
        ]
    },
    {
        id: '7-flex-wrap',
        title: 'Ticket #7: Der endlose Zug (Flex Wrap)',
        difficulty: 'Mid',
        briefing: {
            sender: 'Content Management',
            role: 'Junior Frontend Dev',
            subject: 'Galerie-Bilder quetschen sich unendlich',
            message: `Hi,

ich habe gerade 8 neue Team-Fotos in unsere Mitarbeiter-Galerie (\`.team-gallery\`) geladen.
Die Bilder sind alle 200px breit. Statt aber in die nächste Zeile umzubrechen, entscheidet sich Flexbox dafür, die Bilder auf winzige Streifen zu quetschen!

Kannst du Flexbox sagen, dass die Kinder umbrechen sollen, wenn der Platz in der Zeile nicht mehr reicht?`,
            goals: ['Erlaube der Flexbox-Galerie den Zeilenumbruch', 'Lasse die Breite der Bilder (200px) unangetastet', 'Platziere die korrekte Eigenschaft im Container']
        },
        diagnosis: {
            question: 'Welches ist das Standardverhalten von flexiblen Elementen, wenn der Platz in einer Reihe eng wird?',
            options: [
                { id: 'opt1', text: 'Sie fallen automatisch in die nächste Zeile.', isCorrect: false, feedback: 'Nein, das wäre das Verhalten von Block-Elementen. Flexbox hält per Default alles in einer Zeile.' },
                { id: 'opt2', text: 'Sie werden geschrumpft, um in eine einzige Zeile zu passen (flex-wrap: nowrap).', isCorrect: true, feedback: 'Korrekt! Flexbox quetscht gnadenlos, bis man das Umbrechen erlaubt.' },
                { id: 'opt3', text: 'Sie ragen unsichtbar aus dem Bildschirmrand heraus.', isCorrect: false, feedback: 'Nein, Flex-Items schrumpfen bevorzugt.' },
            ]
        },
        solution: {
            initialHtml: `<div class="team-gallery">
  <div class="member-card">Anna</div>
  <div class="member-card">Ben</div>
  <div class="member-card">Chris</div>
  <div class="member-card">David</div>
  <div class="member-card">Elena</div>
  <div class="member-card">Fiona</div>
  <div class="member-card">Gustav</div>
  <div class="member-card">Hanna</div>
</div>`,
            initialCss: `.team-gallery {
  display: flex;
  gap: 15px;
  background: #f8fafc;
  padding: 20px;
  border: 1px dashed #cbd5e1;
  
  /* Dein Fix hier: */
  
}

.member-card {
  width: 200px;
  height: 100px;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 8px;
}`,
            requiredSelectors: ['.team-gallery'],
            explanation: 'Mit `flex-wrap: wrap;` deaktivierst du das "Quetschen". Flex-Items behalten nun ihre Breite und fließen in die nächste Zeile.',
            targetCssProperties: {
                '.team-gallery': {
                    'flex-wrap': 'wrap'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Suche nach "CSS flexbox allow items to wrap to next line".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Welche Eigenschaft muss ich einem Flex-Container geben, damit die inneren Elemente bei Platzmangel in die nächste Reihe umbrechen?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Füge im `.team-gallery` Selektor einfach `flex-wrap: wrap;` hinzu.' }
        ]
    },
    {
        id: '8-responsive',
        title: 'Ticket #8: Das kaputte Handy-Layout',
        difficulty: 'Senior',
        briefing: {
            sender: 'Mobile Testing Team',
            role: 'Junior Frontend Dev',
            subject: 'DRINGEND: Layout auf dem Handy unbrauchbar',
            message: `Hi,

unser Feature-Raster (\`.feature-grid\`) sieht auf Desktop top aus: Zwei Spalten.
Auf Handys (< 600px) quetschen sich die Boxen aber nebeneinander und der Text bricht heraus.

Kannst du eine Media Query schreiben? Auf kleinen Screens sollen die Spalten sich nicht quetschen, sondern untereinander stapeln.`,
            goals: ['Schreibe eine Media Query für max-width: 600px', 'Veränder die Flussrichtung (flex-direction)', 'Stapel die Elemente untereinander']
        },
        diagnosis: {
            question: 'Wie ändert man in einer Flexbox die Flussrichtung zu "untereinander"?',
            options: [
                { id: 'opt1', text: 'flex-direction: column;', isCorrect: true, feedback: 'Richtig! Standard ist "row".' },
                { id: 'opt2', text: 'display: block;', isCorrect: false, feedback: 'Das verliert Flexbox-Vorteile. flex-direction ist sauberer.' },
                { id: 'opt3', text: 'align-items: vertical;', isCorrect: false, feedback: 'Gibt es nicht.' },
            ]
        },
        solution: {
            initialHtml: `<div class="feature-grid">
  <div class="feature-box">
    <h3>Feature Eins</h3>
    <p>Viel Text, der auf Handys Platz zum Atmen braucht.</p>
  </div>
  <div class="feature-box">
    <h3>Feature Zwei</h3>
    <p>Noch mehr Text, der aktuell das Handy-Layout sprengt.</p>
  </div>
</div>`,
            initialCss: `.feature-grid {
  display: flex;
  gap: 20px;
  background: #f1f5f9;
  padding: 20px;
}

.feature-box {
  background: white;
  padding: 20px;
  flex: 1;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

/* DEIN CODE HIER: Media Query für max-600px! */
`,
            requiredSelectors: ['@media', '.feature-grid'],
            explanation: 'Mit `@media (max-width: 600px)` führst du Code nur auf kleinen Screens aus. `flex-direction: column` stapelt dann alles sauber.',
            targetCssProperties: {
                '.feature-grid': {
                    'flex-direction': 'column'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google nach "CSS Media Queries max-width syntax".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie lautet die genaue Syntax für eine Media Query (max-width 600px) und wie ändere ich darin die flex-direction auf column?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Füge unten ein: @media (max-width: 600px) { .feature-grid { flex-direction: column; } }' }
        ]
    },
    {
        id: '9-z-index',
        title: 'Ticket #9: Das überlagerte Dropdown',
        difficulty: 'Senior',
        briefing: {
            sender: 'Customer Support',
            role: 'Junior Frontend Dev',
            subject: 'Dropdown verschwindet hinter Banner',
            message: `Hallo,

das Dropdown-Menü (\`.user-menu\`) verschwindet komplett HALTER unserem Werbe-Banner (\`.hero-banner\`).
Obwohl wir dem Menü \`z-index: 9999;\` gegeben haben, bringt das nichts.

Löse das Z-Index Rätsel! Das Menü muss drüber schweben.`,
            goals: ['Bringe das User-Menü in den Vordergrund', 'Verstehe den Stacking Context', 'Korrigiere die Eltern-Elemente']
        },
        diagnosis: {
            question: 'Wann ignoriert der Browser die Eigenschaft "z-index" komplett?',
            options: [
                { id: 'opt1', text: 'Wenn der z-index zu hoch ist.', isCorrect: false, feedback: 'Nein.' },
                { id: 'opt2', text: 'Wenn das Element position: static hat (Standard).', isCorrect: true, feedback: 'Richtig! z-index braucht eine Positionierung (relative, absolute, etc.).' },
                { id: 'opt3', text: 'Wenn die Hintergrundfarbe fehlt.', isCorrect: false, feedback: 'Nein.' },
            ]
        },
        solution: {
            initialHtml: `<header class="navbar">
  <span>Logo</span>
  <div class="user-menu">
    <ul><li>Profil</li><li>Logout</li></ul>
  </div>
</header>
<div class="hero-banner">Mega Banner (z-index: 10)</div>`,
            initialCss: `.navbar {
  background: #1e293b;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  
  /* Dein Fix hier: */
  
}

.user-menu {
  position: absolute;
  top: 50px;
  right: 15px;
  background: white;
  color: black;
  border: 1px solid #ccc;
  z-index: 9999;
}

.hero-banner {
  background: #3b82f6;
  color: white;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
}`,
            requiredSelectors: ['.navbar'],
            explanation: 'Das Menü ist in der Navbar "gefangen". Gibt der Navbar `position: relative` und einen höheren `z-index` als dem Banner, damit der gesamte Container nach vorne kommt.',
            targetCssProperties: {
                '.navbar': {
                    'position': 'relative',
                    'z-index': '20'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google nach "z-index not working relative sibling".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Warum greift z-index: 9999 auf einem Kind-Element nicht, wenn das Nachbar-Element (hero-banner) position: relative und z-index: 10 hat?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Gib der `.navbar` `position: relative` und `z-index: 20`.' }
        ]
    },
    {
        id: '10-overflow',
        title: 'Ticket #10: Die wackelige Seite',
        difficulty: 'Senior',
        briefing: {
            sender: 'Quality Assurance',
            role: 'Junior Frontend Dev',
            subject: 'Horizontales Scrollen auf dem Smartphone',
            message: `Hi,

auf Handys kann man die ganze Website seitlich verschieben. Ich vermute, das Header-Bild (\`.hero-image\`) ist zu breit für kleine Screens.

Kannst du das Bild so anpassen, dass es NIEMALS breiter als sein Container wird?`,
            goals: ['Verhindere horizontales Scrollen', 'Mache das Bild responsive', 'Nutze max-width']
        },
        diagnosis: {
            question: 'Wie macht man Bilder im responsiven Webdesign flexibel?',
            options: [
                { id: 'opt1', text: 'width: 100%; immer benutzen.', isCorrect: false, feedback: 'Das bläht kleine Bilder unscharf auf.' },
                { id: 'opt2', text: 'max-width: 100%; und height: auto;', isCorrect: true, feedback: 'Perfekt! Es schrumpft bei Bedarf, wächst aber nicht über Originalgröße.' },
                { id: 'opt3', text: 'overflow: hidden; auf dem body.', isCorrect: false, feedback: 'Symptom-Bekämpfung, keine Lösung.' },
            ]
        },
        solution: {
            initialHtml: `<div class="article-container">
  <img src="https://placehold.co/800x400?text=News+Image" alt="News Image" class="hero-image">
</div>`,
            initialCss: `body { width: 350px; background: #eee; }
.article-container { background: white; padding: 10px; }
.hero-image {
  /* Das Bild ist 800px breit und sprengt den 350px Body! */
  
  /* Dein Fix hier: */
  
}`,
            requiredSelectors: ['.hero-image'],
            explanation: 'Mit `max-width: 100%;` passt sich das Bild dem kleineren Container an, ohne die Seite zu verbreitern.',
            targetCssProperties: {
                '.hero-image': {
                    'max-width': '100%'
                }
            }
        },
        hints: [
            { level: 1, title: 'Der Recherche-Schubser', text: 'Google nach "CSS responsive images max-width".' },
            { level: 2, title: 'KI-Prompt', text: 'Frag deine KI: "Wie verhindere ich mit CSS, dass ein großes Bild breiter wird als sein schmaler Eltern-Container?"' },
            { level: 3, title: 'Der konkrete Mentor-Hinweis', text: 'Gib der `.hero-image` `max-width: 100%;`.' }
        ]
    }
];
