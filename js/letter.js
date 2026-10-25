(() => {
  'use strict';
  const paper = document.getElementById('letter-paper');
  const content = document.getElementById('letter-content');
  const invitation = document.getElementById('envelope-invitation');
  const openButton = document.getElementById('open-letter');
  const letterHashes = ['#thu', '#letter-title'];

  function openLetter() {
    content.hidden = false;
    invitation.hidden = true;
    paper.classList.remove('is-sealed');
    paper.classList.add('is-open');
    openButton.setAttribute('aria-expanded', 'true');
    window.dispatchEvent(new Event('moment:opened'));
  }

  if (!letterHashes.includes(location.hash)) {
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
  addEventListener('hashchange', () => {
    if (letterHashes.includes(location.hash)) openLetter();
  });

  const button = document.getElementById('hold-hand');
  const message = document.getElementById('comfort-message');
  const words = [
    'Anh nắm tay em rồi. Em không phải đi qua hôm nay một mình đâu.',
    'Mệt thì mình nghỉ một chút. Minh vẫn ở đây, cùng em.',
    'Em không cần cố mạnh mẽ. Với anh, em cứ là em thôi.',
    'Một cái nắm tay thật ấm. Mong lòng em nhẹ hơn một chút.',
    'Không cần vội trả lời. Anh chỉ muốn em biết rằng anh thương em.'
  ];
  let count = 0;
  button.addEventListener('click', () => {
    message.textContent = words[count % words.length];
    count += 1;
    button.classList.add('held');
    button.innerHTML = '<span aria-hidden="true">♡</span> Minh đang nắm tay em đây';
  });
})();
