(() => {
  const progress = document.getElementById('progress');
  let scheduled = false;
  function updateProgress() {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? Math.min(100, window.scrollY / available * 100) : 0}%`;
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  window.addEventListener('resize', updateProgress);
  window.addEventListener('load', updateProgress);
  updateProgress();
  const paper = document.getElementById('letter-paper');
  const content = document.getElementById('letter-content');
  const invitation = document.getElementById('envelope-invitation');
  const openButton = document.getElementById('open-letter');

  function openLetter() {
    content.hidden = false;
    invitation.hidden = true;
    paper.classList.remove('is-sealed');
    paper.classList.add('is-open');
    openButton.setAttribute('aria-expanded', 'true');
    updateProgress();
  }

  if (window.location.hash !== '#thu' && window.location.hash !== '#letter-title') {
    content.hidden = true;
    invitation.hidden = false;
    paper.classList.add('is-sealed');
  }
  openButton.addEventListener('click', () => {
    openLetter();
    const title = document.getElementById('letter-title');
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  });
  document.querySelectorAll('a[href="#thu"], a[href="#letter-title"]').forEach(link => {
    link.addEventListener('click', openLetter);
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#thu' || window.location.hash === '#letter-title') openLetter();
  });

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.letter-aside, .memory-heading, .photo-grid figure, .journey > h2, .timeline > *, .closing h2').forEach(element => {
      element.classList.add('reveal-pending');
      observer.observe(element);
    });
  }

  const button = document.getElementById('hold-hand');
  const message = document.getElementById('comfort-message');
  const words = [
    'Anh nắm tay em rồi. Em không phải đi qua hôm nay một mình đâu.',
    'Mệt thì mình nghỉ một chút. Anh vẫn ở đây, cùng em.',
    'Em không cần cố mạnh mẽ. Với anh, em cứ là em thôi.',
    'Một cái nắm tay thật ấm. Mong lòng em nhẹ hơn một chút.',
    'Không cần vội trả lời. Anh chỉ muốn em biết rằng anh thương em.'
  ];
  let count = 0;
  button.addEventListener('click', () => {
    message.textContent = words[count % words.length];
    count += 1;
    button.classList.add('held');
    button.innerHTML = '<span aria-hidden="true">♡</span> Anh đang nắm tay em đây';
  });
})();
