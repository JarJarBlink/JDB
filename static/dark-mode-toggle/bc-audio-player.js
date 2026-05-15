//Coded by Exodia JAR
(function () {
  function fmt(s) {
    s = isNaN(s) || !isFinite(s) ? 0 : Math.floor(s);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function updateVolIcon(iconEl, value) {
    iconEl.textContent = value == 0 ? '🔇' : value < 50 ? '🔉' : '🔊';
  }

  function initPlayer(container) {
    container.dataset.bcInit = '1';
    const src = container.dataset.src || '';
    const btn = container.querySelector('.bc-play-btn');
    const seek = container.querySelector('.bc-seek');
    const timeEl = container.querySelector('.bc-time');
    const volInput = container.querySelector('.bc-vol');
    const volIcon = container.querySelector('.bc-vol-icon');

    if (!btn || !seek || !timeEl) return;

    const audio = new Audio();
    if (src) audio.src = src;
    audio.volume = volInput ? (volInput.value || 80) / 100 : 0.8;
    audio.preload = 'metadata';

    let playing = false;

    function setPlayIcon(isPlaying) {
      btn.textContent = isPlaying ? '⏸' : '▶';
      btn.setAttribute('aria-label', isPlaying ? 'Stop' : 'Play');
    }

    /* 播放 / 暫停 */
    btn.addEventListener('click', () => {
      if (!audio.src) return;
      if (playing) {
        audio.pause();
        playing = false;
      } else {
        audio.play().catch(() => {});
        playing = true;
      }
      setPlayIcon(playing);
    });

    /* 進度更新 */
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        seek.value = Math.round((audio.currentTime / audio.duration) * 100);
        timeEl.textContent = fmt(audio.currentTime) + ' / ' + fmt(audio.duration);
      }
    });

    /* metadata 載入後顯示總時長 */
    audio.addEventListener('loadedmetadata', () => {
      timeEl.textContent = '0:00 / ' + fmt(audio.duration);
    });

    /* 播放結束 */
    audio.addEventListener('ended', () => {
      playing = false;
      setPlayIcon(false);
      seek.value = 0;
      timeEl.textContent = '0:00 / ' + fmt(audio.duration);
    });

    /* seek 拖曳 */
    seek.addEventListener('input', () => {
      if (audio.duration) {
        audio.currentTime = (seek.value / 100) * audio.duration;
      }
    });

    /* 音量 */
    if (volInput) {
      audio.volume = (volInput.value || 80) / 100;
      volInput.addEventListener('input', () => {
          audio.volume = volInput.value / 100;
          if (volIcon) updateVolIcon(volIcon, volInput.value);
      });
    }
  }

  function initAll() {
    document.querySelectorAll('.bc-player:not([data-bc-init])').forEach(initPlayer);
  }

  window.initBcPlayers = function(container) {
    const root = container instanceof Element ? container : document;
    root.querySelectorAll('.bc-player:not([data-bc-init])').forEach(initPlayer);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
