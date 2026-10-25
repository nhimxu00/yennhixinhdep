(() => {
  'use strict';
  const song = document.getElementById('momentSong');
  const buttons = [...document.querySelectorAll('[data-music-toggle]')];
  if (!song || !buttons.length) return;
  const status = document.querySelector('[data-music-status]');
  const hints = [...document.querySelectorAll('[data-music-hint]')];
  const storageKey = 'nhi-a-thousand-years-position';
  let starting = false;
  let wantsPlayback = true;
  let leaving = false;
  let lastSaved = 0;
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(storageKey)); } catch (_) { /* Storage is optional. */ }
  song.volume = .4;

  function update(playing) {
    document.body.classList.toggle('music-playing', playing);
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(playing));
      button.querySelector('[data-music-label]').textContent = playing ? 'Tắt nhạc' : 'Bật nhạc';
      button.title = playing ? 'Tắt A Thousand Years' : 'Nghe A Thousand Years – Piano & Cello';
    });
    if (playing) hints.forEach(hint => { hint.hidden = true; });
  }
  function remember() {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ time: song.currentTime }));
    } catch (_) { /* Playback does not depend on storage. */ }
  }
  async function play(fromClick = false) {
    if (starting) return;
    starting = true;
    wantsPlayback = true;
    try {
      await song.play();
      update(!song.paused);
      remember();
      if (status && fromClick) status.textContent = 'Đang phát A Thousand Years – Piano & Cello.';
    } catch (_) {
      update(false);
      hints.forEach(hint => { hint.hidden = false; });
      if (status) status.textContent = 'Chạm Bật nhạc hoặc mở lá thư để nghe A Thousand Years cùng Minh.';
    } finally {
      starting = false;
    }
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (song.paused) {
        void play(true);
      } else {
        wantsPlayback = false;
        song.pause();
        remember();
        if (status) status.textContent = 'Đã tắt nhạc.';
      }
    });
  });

  // Sound may require a real gesture, including the gesture used to open the letter.
  function retryOnGesture(event) {
    if (!wantsPlayback || !song.paused || starting) return;
    if (event.target.closest?.('[data-music-toggle]')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    void play();
  }
  document.addEventListener('pointerdown', retryOnGesture, { capture: true, passive: true });
  document.addEventListener('keydown', retryOnGesture, { capture: true });
  addEventListener('moment:opened', () => { if (wantsPlayback && song.paused) void play(); });
  song.addEventListener('play', () => { wantsPlayback = true; update(true); });
  song.addEventListener('pause', () => {
    update(false);
    if (!leaving) { wantsPlayback = false; remember(); }
  });
  song.addEventListener('error', () => {
    update(false);
    if (status) status.textContent = 'Chưa tải được nhạc. Em chạm Bật nhạc để thử lại nhé.';
  });
  song.addEventListener('timeupdate', () => {
    if (Date.now() - lastSaved > 5000) { remember(); lastSaved = Date.now(); }
  });
  song.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(saved?.time) && saved.time > 0 && Number.isFinite(song.duration)) {
      song.currentTime = saved.time % song.duration;
    }
  }, { once: true });
  addEventListener('pagehide', () => { leaving = true; remember(); });
  addEventListener('pageshow', event => {
    leaving = false;
    if (event.persisted && wantsPlayback && song.paused) void play();
    update(!song.paused);
  });
  update(!song.paused);
  void play();
})();
