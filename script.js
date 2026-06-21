// Button 1: показує лише поточну годину, хвилини і секунди
document.getElementById('clickMe1').addEventListener('click', function() {
  const now = new Date();
  const time = now.toLocaleTimeString('uk-UA', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
  document.getElementById('output').textContent = time;
});

// Button 2: показує час і назву сьогоднішнього дня (наприклад: 17:05:23 неділя)
document.getElementById('clickMe2').addEventListener('click', function() {
  const now = new Date();
  const time = now.toLocaleTimeString('uk-UA', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
  const weekday = now.toLocaleDateString('uk-UA', {weekday: 'long'});
  document.getElementById('output').textContent = time + ' ' + weekday;
});

// Button 3: показує повну інформацію: weekday, повна дата і час у форматі 'неділя, 21 червня 2026 р. о 17:05:23'
document.getElementById('clickMe3').addEventListener('click', function() {
  const now = new Date();
  const time = now.toLocaleTimeString('uk-UA', {hour: '2-digit', minute: '2-digit', second: '2-digit'});
  const weekday = now.toLocaleDateString('uk-UA', {weekday: 'long'});
  const dateLong = now.toLocaleDateString('uk-UA', {year: 'numeric', month: 'long', day: 'numeric'});
  document.getElementById('output').textContent = weekday + ', ' + dateLong + ' о ' + time;
});

// Cat: moving and prompting after 10s of no interaction
(function() {
  const catMessage = document.getElementById('cat-message');
  const cat = document.getElementById('cat');
  let catTimer = null;

  function showCatPrompt() {
    if (catMessage) catMessage.classList.remove('hidden');
  }
  function hideCatPrompt() {
    if (catMessage) catMessage.classList.add('hidden');
  }
  function resetCatTimer() {
    hideCatPrompt();
    if (catTimer) clearTimeout(catTimer);
    catTimer = setTimeout(showCatPrompt, 10000);
  }

  // Start timer on load
  resetCatTimer();

  // Reset timer on any button click and hide prompt immediately
  ['clickMe1','clickMe2','clickMe3'].forEach(function(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function() {
      hideCatPrompt();
      if (catTimer) clearTimeout(catTimer);
      // restart timer after interaction
      catTimer = setTimeout(showCatPrompt, 10000);
    });
  });

})();
