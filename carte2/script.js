document.addEventListener('DOMContentLoaded', () => {
  const selectionScreen = document.getElementById('selection-screen');
  const appScreen = document.getElementById('app-screen');
  const resultScreen = document.getElementById('result-screen');
  
  const suitSelection = document.getElementById('suit-selection');
  const valueSelection = document.getElementById('value-selection');
  const secretTitle = document.getElementById('secret-title');
  const extractArea = document.getElementById('extract-area');
  const clockElement = document.getElementById('clock');
  const cardImage = document.getElementById('card-image');
  const btnBackSuit = document.getElementById('btn-back-suit');
  const btnBackApp = document.getElementById('btn-back-app');

  let fakeSeconds = 11;
  let magicMode = false;
  let secretTaps = 0;
  
  // Variabili per la modalità normale
  let chosenSuit = '';
  let chosenValue = '';

  // Precarica tutte le immagini (pesca dalla cartella carte del primo progetto per non duplicare)
  const preloadSuits = ['H', 'D', 'C', 'S'];
  const preloadValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'];
  preloadValues.forEach(v => {
    preloadSuits.forEach(s => {
      const img = new Image();
      img.src = `../carte/cards/${v}${s}.png`;
    });
  });

  // Funzione per aggiornare l'orologio (sempre attivo, serve per la magic mode)
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
  setInterval(updateClock, 1000);
  updateClock();

  function goFullscreen() {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    }
  }

  // --- TRUCCO SEGRETO ---
  // Se clicca 5 volte sul titolo "Inserisci la tua carta", si attiva la modalità magia e salta la selezione
  secretTitle.addEventListener('click', () => {
    secretTaps++;
    if (secretTaps >= 5) {
      magicMode = true;
      goFullscreen();
      selectionScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
    }
    // Resetta i tap dopo un po' se non arriva a 5
    setTimeout(() => { secretTaps = 0; }, 2000);
  });

  // --- FLUSSO NORMALE (Spettatore sceglie la carta) ---
  const suitBtns = document.querySelectorAll('.suit-btn');
  suitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chosenSuit = btn.getAttribute('data-suit');
      suitSelection.classList.add('hidden');
      valueSelection.classList.remove('hidden');
    });
  });

  btnBackSuit.addEventListener('click', () => {
    valueSelection.classList.add('hidden');
    suitSelection.classList.remove('hidden');
    chosenSuit = '';
  });

  const valBtns = document.querySelectorAll('.val-btn');
  valBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chosenValue = btn.getAttribute('data-val');
      
      // Ha scelto tutto, passiamo alla schermata Svela
      magicMode = false;
      goFullscreen();
      selectionScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');
    });
  });

  // --- SCHERMATA SVELA ---
  const valueMap = {
    11: 'A', 12: '2', 13: '3', 14: '4', 15: '5',
    16: '6', 17: '7', 18: '8', 19: '9', 20: '0',
    21: 'J', 22: 'Q', 23: 'K'
  };

  extractArea.addEventListener('click', (e) => {
    let finalSuit = chosenSuit;
    let finalValue = chosenValue;

    if (magicMode) {
      // Se siamo nel trucco, sovrascriviamo la carta usando l'algoritmo
      const rect = extractArea.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const clickX = e.clientX;
      const clickY = e.clientY;

      if (clickX < centerX && clickY < centerY) {
        finalSuit = 'H';
      } else if (clickX >= centerX && clickY < centerY) {
        finalSuit = 'D';
      } else if (clickX < centerX && clickY >= centerY) {
        finalSuit = 'C';
      } else if (clickX >= centerX && clickY >= centerY) {
        finalSuit = 'S';
      }

      let displayedSeconds = fakeSeconds - 1;
      if (displayedSeconds < 11) displayedSeconds = 23;
      finalValue = valueMap[displayedSeconds];
    }

    // Se magicMode è false, userà la carta scelta dall'utente normalmente

    const imageName = `${finalValue}${finalSuit}.png`;
    cardImage.src = `../carte/cards/${imageName}`;
    
    appScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
  });

  // Pulsante per tornare indietro dalla schermata "Svela"
  btnBackApp.addEventListener('click', () => {
    appScreen.classList.add('hidden');
    selectionScreen.classList.remove('hidden');
    
    // Resetta lo stato di selezione
    valueSelection.classList.add('hidden');
    suitSelection.classList.remove('hidden');
    chosenSuit = '';
    chosenValue = '';
    magicMode = false;
  });

  // Torna indietro dalla carta svelata
  resultScreen.addEventListener('click', () => {
    resultScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    cardImage.src = '';
  });

});
