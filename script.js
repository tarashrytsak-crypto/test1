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

// Cat and mouse: mouse runs faster, cats chase it on different trajectories
(function() {
  const container = document.getElementById('cat-container');
  const cat1 = document.getElementById('cat');
  const cat2 = document.getElementById('cat2');
  const mouse = document.getElementById('mouse');
  let timers = []; // timeouts for movement
  let foods = []; // active food ids

  function clearAllTimers() {
    timers.forEach(t => clearTimeout(t));
    timers = [];
  }

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function moveMouseOnce() {
    if (!mouse || !container) return;
    const cRect = container.getBoundingClientRect();
    const mRect = mouse.getBoundingClientRect();
    const maxX = Math.max(0, cRect.width - mRect.width);
    const maxY = Math.max(0, cRect.height - mRect.height);
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    mouse.style.left = x + 'px';
    mouse.style.top = y + 'px';
    mouse.style.transform = Math.random() > 0.5 ? 'scaleX(1)' : 'scaleX(-1)';
  }

  function scheduleMouse() {
    function step() {
      moveMouseOnce();
      const next = 350 + Math.random() * 450; // 350-800ms
      timers.push(setTimeout(step, Math.floor(next)));
    }
    step();
  }

  // create food on container click
  if (container) {
    container.addEventListener('click', function(e) {
      const cRect = container.getBoundingClientRect();
      const size = 18;
      const x = e.clientX - cRect.left - size/2;
      const y = e.clientY - cRect.top - size/2;
      const id = 'f' + Date.now() + Math.floor(Math.random()*1000);
      const el = document.createElement('div');
      el.className = 'food';
      el.dataset.foodId = id;
      el.style.left = Math.max(0, Math.min(cRect.width - size, x)) + 'px';
      el.style.top = Math.max(0, Math.min(cRect.height - size, y)) + 'px';
      container.appendChild(el);
      foods.push(id);
      // small pop animation
      requestAnimationFrame(() => { el.style.transform = 'scale(1.08)'; setTimeout(()=> el.style.transform='scale(1)',120); });
    });
  }

  function chaseStep(cat, speedFactor, jitter) {
    if (!cat || !container) return;
    const cRect = container.getBoundingClientRect();
    const catRect = cat.getBoundingClientRect();

    // if food exists, target the nearest food
    // clean up missing foods
    foods = foods.filter(id => document.querySelector('[data-food-id="' + id + '"]'));
    if (foods.length > 0) {
      let nearestEl = null;
      let nearestId = null;
      let bestDist = Infinity;
      const catCenterX = (catRect.left - cRect.left) + catRect.width / 2;
      const catCenterY = (catRect.top - cRect.top) + catRect.height / 2;
      foods.forEach(id => {
        const f = document.querySelector('[data-food-id="' + id + '"]');
        if (!f) return;
        const fRect = f.getBoundingClientRect();
        const fx = (fRect.left - cRect.left) + fRect.width/2;
        const fy = (fRect.top - cRect.top) + fRect.height/2;
        const dx = fx - catCenterX; const dy = fy - catCenterY;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < bestDist) { bestDist = d; nearestEl = f; nearestId = id; }
      });
      if (nearestEl) {
        const fRect = nearestEl.getBoundingClientRect();
        const fx = (fRect.left - cRect.left) + fRect.width/2;
        const fy = (fRect.top - cRect.top) + fRect.height/2;
        const dx = fx - ((catRect.left - cRect.left) + catRect.width/2);
        const dy = fy - ((catRect.top - cRect.top) + catRect.height/2);
        const stepX = dx * Math.min(1, speedFactor * 1.6) + (Math.random() - 0.5) * jitter;
        const stepY = dy * Math.min(1, speedFactor * 1.6) + (Math.random() - 0.5) * jitter;
        const newLeft = clamp((catRect.left - cRect.left) + stepX, 0, Math.max(0, cRect.width - catRect.width));
        const newTop = clamp((catRect.top - cRect.top) + stepY, 0, Math.max(0, cRect.height - catRect.height));
        cat.style.left = newLeft + 'px';
        cat.style.top = newTop + 'px';
        cat.style.transform = (dx >= 0) ? 'scaleX(1)' : 'scaleX(-1)';
        // if close enough, eat it
        if (bestDist < 36) {
          // remove element with small shrink
          nearestEl.style.transition = 'transform 0.12s ease, opacity 0.12s ease';
          nearestEl.style.transform = 'scale(0.2)';
          nearestEl.style.opacity = '0';
          setTimeout(() => { try{ nearestEl.remove(); } catch(e){} }, 140);
          foods = foods.filter(id => id !== nearestId);
        }
        return; // prioritize food
      }
    }

    // else chase mouse as before
    if (!mouse) return;
    const mouseRect = mouse.getBoundingClientRect();

    const catCenterX = (catRect.left - cRect.left) + catRect.width / 2;
    const catCenterY = (catRect.top - cRect.top) + catRect.height / 2;
    const mouseCenterX = (mouseRect.left - cRect.left) + mouseRect.width / 2;
    const mouseCenterY = (mouseRect.top - cRect.top) + mouseRect.height / 2;

    const dx = mouseCenterX - catCenterX;
    const dy = mouseCenterY - catCenterY;

    // move a fraction of the distance toward mouse, add small jitter
    const stepX = dx * speedFactor + (Math.random() - 0.5) * jitter;
    const stepY = dy * speedFactor + (Math.random() - 0.5) * jitter;

    // compute new top-left for cat (convert from center back to top-left)
    const newLeft = clamp((catRect.left - cRect.left) + stepX, 0, Math.max(0, cRect.width - catRect.width));
    const newTop = clamp((catRect.top - cRect.top) + stepY, 0, Math.max(0, cRect.height - catRect.height));

    cat.style.left = newLeft + 'px';
    cat.style.top = newTop + 'px';

    // flip cat based on horizontal movement toward mouse
    cat.style.transform = (dx >= 0) ? 'scaleX(1)' : 'scaleX(-1)';
  }

  function scheduleChase(cat, minMs, maxMs, speedFactor, jitter) {
    function step() {
      chaseStep(cat, speedFactor, jitter);
      const next = Math.floor(minMs + Math.random() * (maxMs - minMs));
      timers.push(setTimeout(step, next));
    }
    step();
  }

  // start behaviors
  clearAllTimers();
  scheduleMouse();
  // cats chase with different parameters (different trajectories)
  scheduleChase(cat1, 300, 800, 0.28, 30); // cat1 slower, smoother
  scheduleChase(cat2, 220, 640, 0.4, 50);  // cat2 quicker, more aggressive

  // pause on hover
  if (container) {
    container.addEventListener('mouseenter', function() { clearAllTimers(); });
    container.addEventListener('mouseleave', function() {
      clearAllTimers();
      scheduleMouse();
      scheduleChase(cat1, 300, 800, 0.28, 30);
      scheduleChase(cat2, 220, 640, 0.4, 50);
    });
  }
n})();
