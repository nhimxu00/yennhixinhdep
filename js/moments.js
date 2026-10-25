(() => {
  'use strict';
  const progress = document.getElementById('momentProgress');
  function updateProgress() {
    if (!progress) return;
    const available = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${available > 0 ? Math.min(100, scrollY / available * 100) : 0}%`;
  }
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  addEventListener('load', updateProgress);
  addEventListener('moment:opened', updateProgress);
  updateProgress();

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .06 });
    document.querySelectorAll('[data-reveal]').forEach(element => {
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
  }

  const lights = document.getElementById('momentLights');
  lights?.addEventListener('click', () => {
    const off = document.body.classList.toggle('fireflies-off');
    lights.setAttribute('aria-pressed', String(!off));
    lights.querySelector('.light-label').textContent = off ? 'Bật đom đóm' : 'Tắt đom đóm';
  });

  // Keep previously shared birthday section links working after the new homepage.
  const birthdaySections = ['#prologue', '#birthdayZone', '#letterSection', '#waxEnvelope', '#interactiveGarden'];
  if (document.body.classList.contains('timeline-page') && birthdaySections.includes(location.hash)) {
    location.replace(`sinh-nhat.html${location.hash}`);
  }
})();
