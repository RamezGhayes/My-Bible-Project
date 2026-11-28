// Standalone overview pages (overview/*.html): keep the reader inside the overview. Links that would leave it become
// plain text, and a verse reference shows the verse in a small card at the bottom instead of opening the chapter.
(function () {
  var root = document.querySelector('.ov-w'); if (!root || !window.obPeek) return;
  if (window.obKeepIn) window.obKeepIn(root);
  var card = document.createElement('div'); card.className = 'ob-peek fx'; card.hidden = true; document.body.appendChild(card);
  window.obPeek(root, card, { chapter: false });
})();
