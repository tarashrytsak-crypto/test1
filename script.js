document.getElementById('clickMe').addEventListener('click', function() {
  document.getElementById('output').textContent = 'Кнопку натиснуто ' + new Date().toLocaleTimeString();
});