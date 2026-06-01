document.addEventListener('DOMContentLoaded', () => {
  const startScreen = document.getElementById('start-screen');
  const appScreen = document.getElementById('app-screen');
  const resultScreen = document.getElementById('result-screen');
  const btnStart = document.getElementById('btn-start');
  const extractArea = document.getElementById('extract-area');
  const clockElement = document.getElementById('clock');
  const cardImage = document.getElementById('card-image');

  let fakeSeconds = 11;

  // Funzione per aggiornare l'orologio
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const secondsStr = String(fakeSeconds).padStart(2, '0');
    
    clockElement.textContent = `${hours}:${minutes}:${secondsStr}`;

    fakeSeconds++;
    if (fakeSeconds > 23) {
      fakeSeconds = 11;
    }
  }

  // Avvia l'orologio falso
  setInterval(updateClock, 1000);
  updateClock(); // Prima chiamata immediata

  // Gestione click "Inizia"
  btnStart.addEventListener('click', () => {
    // Prova ad andare in Fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log("Errore fullscreen:", err);
      });
    }

    // Mostra l'app vera e propria
    startScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
  });

  // Mappa dei valori delle carte (11-23) per i nomi dei file (A, 2, ..., 0 per il 10, J, Q, K)
  const valueMap = {
    11: 'A', 12: '2', 13: '3', 14: '4', 15: '5',
    16: '6', 17: '7', 18: '8', 19: '9', 20: '0',
    21: 'J', 22: 'Q', 23: 'K'
  };

  // Gestione click per estrarre la carta
  extractArea.addEventListener('click', (e) => {
    // Ottieni le dimensioni e la posizione dell'area cliccabile
    const rect = extractArea.getBoundingClientRect();
    
    // Trova il centro dell'area
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Coordinate del click
    const clickX = e.clientX;
    const clickY = e.clientY;

    let suit = ''; // S, D, C, H

    // Determina il seme in base al quadrante del click rispetto al centro del bottone
    if (clickX < centerX && clickY < centerY) {
      // Alto a sinistra -> Cuori
      suit = 'H';
    } else if (clickX >= centerX && clickY < centerY) {
      // Alto a destra -> Quadri
      suit = 'D';
    } else if (clickX < centerX && clickY >= centerY) {
      // Basso a sinistra -> Fiori
      suit = 'C';
    } else if (clickX >= centerX && clickY >= centerY) {
      // Basso a destra -> Picche
      suit = 'S';
    }

    // Per estrarre il valore corretto della carta al momento del click
    // Dato che updateClock scatta e avanza i secondi, dobbiamo prendere il fakeSeconds "attualmente a schermo"
    // Dato che l'abbiamo già incrementato per il giro successivo, dobbiamo prendere quello precedente
    // Ma per semplicità calcoliamo il valore attuale a schermo.
    let displayedSeconds = fakeSeconds - 1;
    if (displayedSeconds < 11) displayedSeconds = 23;

    const value = valueMap[displayedSeconds];

    // Nome file dell'immagine
    const imageName = `${value}${suit}.png`;
    
    // Imposta immagine e mostra risultato
    cardImage.src = `cards/${imageName}`;
    appScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
  });
  
  // Opzionale: Cliccando sulla carta si ricarica per farlo di nuovo?
  resultScreen.addEventListener('click', () => {
    // Toglie il fullscreen e ricarica, oppure torna alla schermata di estrazione
    // Per ora torniamo alla schermata di estrazione
    resultScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
  });

});
