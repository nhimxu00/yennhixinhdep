/**
 * ĐÓA HOA DÀNH CHO YẾN NHI · 10/09/2026
 * Interactive Chibi Storybook & Birthday Celebration JS
 */

(() => {
  "use strict";

  // --- 1. Audio Synthesizer Chimes (Web Audio API) ---
  const playBirthdayChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Joyful major chord)
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 1.3);
      });
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  };

  // --- 2. Embedded Canvas Confetti Engine ---
  const confettiCanvas = document.getElementById("confettiCanvas");
  let confettiCtx = confettiCanvas?.getContext("2d");
  let particles = [];
  let confettiAnimationId = null;

  const resizeConfetti = () => {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resizeConfetti, { passive: true });
  resizeConfetti();

  const confettiColors = ["#f77f98", "#ffb5c5", "#ffd6ba", "#f6c867", "#7ebc89", "#b8a7ea", "#ffffff"];

  const launchConfetti = (count = 100, originX = window.innerWidth / 2, originY = window.innerHeight / 2) => {
    if (!confettiCtx) return;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 12;
      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 3,
        size: 5 + Math.random() * 7,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 0,
        maxLife: 100 + Math.random() * 60,
        shape: Math.random() > 0.4 ? "rect" : "circle"
      });
    }

    if (!confettiAnimationId) {
      animateConfetti();
    }
  };

  const animateConfetti = () => {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.98; // friction
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      confettiCtx.save();
      confettiCtx.globalAlpha = p.opacity;
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;

      if (p.shape === "rect") {
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();

      if (p.life >= p.maxLife || p.y > confettiCanvas.height + 50) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      confettiAnimationId = null;
    }
  };

  // --- 3. Scroll Progress & Reveal Animations ---
  const scrollBar = document.getElementById("scrollBar");
  const updateScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    if (scrollBar) {
      scrollBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  };
  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // --- 4. Lights Garland Toggle (Classic Shizu-ka Feature) ---
  const dockLights = document.getElementById("dockLights");
  dockLights?.addEventListener("click", () => {
    const isNowOn = document.body.classList.toggle("lights-on");
    dockLights.setAttribute("aria-pressed", String(isNowOn));
    const label = dockLights.querySelector(".dock-btn__text");
    if (label) label.textContent = isNowOn ? "Tắt đèn" : "Bật đèn";
    if (isNowOn) {
      launchConfetti(40, window.innerWidth / 2, 80);
    }
  });

  // Automatically turn lights on after 1.5s for magical feel
  window.setTimeout(() => {
    if (!document.body.classList.contains("lights-on")) {
      document.body.classList.add("lights-on");
      dockLights?.setAttribute("aria-pressed", "true");
      const label = dockLights?.querySelector(".dock-btn__text");
      if (label) label.textContent = "Tắt đèn";
    }
  }, 1200);

  // --- 5. Music Controller ---
  const dockMusic = document.getElementById("dockMusic");
  const song = document.getElementById("birthdaySong");
  const musicIcon = dockMusic?.querySelector(".dock-btn__icon--music");
  const musicText = dockMusic?.querySelector(".dock-btn__text");

  const updateMusicUI = (isPlaying) => {
    if (!dockMusic) return;
    dockMusic.setAttribute("aria-pressed", String(isPlaying));
    if (musicIcon) musicIcon.classList.toggle("is-playing", isPlaying);
    if (musicText) musicText.textContent = isPlaying ? "Tắt nhạc" : "Bật nhạc";
  };

  dockMusic?.addEventListener("click", async () => {
    if (!song) return;
    if (song.paused) {
      try {
        await song.play();
        updateMusicUI(true);
      } catch (err) {
        updateMusicUI(false);
      }
    } else {
      song.pause();
      updateMusicUI(false);
    }
  });

  song?.addEventListener("play", () => updateMusicUI(true));
  song?.addEventListener("pause", () => updateMusicUI(false));

  // --- 6. Floating Balloons System (Spells "Y - Ê - N - N - H - I - 10·09") ---
  const dockBalloons = document.getElementById("dockBalloons");
  const balloonsContainer = document.getElementById("balloonsContainer");
  const balloonChars = ["Y", "Ê", "N", "N", "H", "I", "🌸", "10", "·", "09"];
  const balloonColors = [
    "#f77f98", "#ff9770", "#ffd670", "#7ebc89",
    "#70d6ff", "#b8a7ea", "#ff85a1", "#ffd166",
    "#a0c4ff", "#ffc6ff"
  ];

  const releaseBalloons = () => {
    if (!balloonsContainer) return;
    balloonChars.forEach((char, index) => {
      const balloon = document.createElement("div");
      balloon.className = "balloon";
      
      const leftPos = 6 + (index * 88) / balloonChars.length + (Math.random() * 4 - 2);
      balloon.style.left = `${leftPos}%`;
      balloon.style.animationDelay = `${index * 0.35}s`;
      balloon.style.animationDuration = `${12 + Math.random() * 4}s`;

      const color = balloonColors[index % balloonColors.length];
      balloon.innerHTML = `
        <div class="balloon__body" style="background: ${color}; color: #ffffff;">
          <span>${char}</span>
        </div>
        <div class="balloon__string"></div>
      `;

      balloonsContainer.appendChild(balloon);

      window.setTimeout(() => {
        balloon.remove();
      }, 16000);
    });

    launchConfetti(45, window.innerWidth * 0.5, window.innerHeight * 0.85);
  };

  dockBalloons?.addEventListener("click", releaseBalloons);

  // --- 7. Interactive Garden & Bloom Wishes ---
  const interactiveGarden = document.getElementById("interactiveGarden");
  const waterButton = document.getElementById("waterButton");
  const waterLabel = waterButton?.querySelector(".water-label");
  const wishText = document.getElementById("wishText");
  const wishIcon = document.getElementById("wishIcon");
  const wishCount = document.getElementById("wishCount");
  const wishDots = document.querySelectorAll("#wishDots .dot");
  const petalLayer = document.getElementById("petalLayer");

  const gardenWishes = [
    {
      icon: "🌤️",
      text: "Điều ước 1: Chúc em mỗi sớm mai thức dậy lòng đều thấy nhẹ nhõm, không vương vấn âu lo của ngày cũ."
    },
    {
      icon: "🪴",
      text: "Điều ước 2: Chúc em luôn an lòng khi im lặng, và đủ dũng khí khi muốn cất lời, không cần sợ hãi."
    },
    {
      icon: "🤍",
      text: "Điều ước 3: Chúc em gặp những người không hối thúc em phải nở, chỉ âm thầm giữ gió khỏi làm đau cánh hoa."
    },
    {
      icon: "🌸",
      text: "Điều ước 4: Chúc Yến Nhi sẽ tự tin nở rực rỡ vào mùa em tự chọn — vì chính em, theo cách của riêng em!"
    }
  ];

  let currentWishIdx = 0;

  const triggerPetalShower = () => {
    if (!petalLayer) return;
    petalLayer.innerHTML = "";
    for (let i = 0; i < 28; i++) {
      const petal = document.createElement("span");
      petal.style.position = "absolute";
      petal.style.top = "-20px";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${14 + Math.random() * 14}px`;
      petal.style.color = Math.random() > 0.5 ? "#f77f98" : "#ffb5c5";
      petal.style.opacity = "0.9";
      petal.style.pointerEvents = "none";
      petal.textContent = i % 2 === 0 ? "🌸" : "✿";
      petal.style.transition = `all ${4 + Math.random() * 3}s linear`;

      petalLayer.appendChild(petal);

      window.setTimeout(() => {
        petal.style.transform = `translate(${Math.random() * 80 - 40}px, 350px) rotate(${Math.random() * 360}deg)`;
        petal.style.opacity = "0";
      }, 50);
    }
  };

  waterButton?.addEventListener("click", () => {
    if (!interactiveGarden || !wishText || !wishIcon || !wishCount || !waterLabel) return;

    if (currentWishIdx >= gardenWishes.length) {
      // Reset
      currentWishIdx = 0;
      interactiveGarden.style.setProperty("--bloom", "0");
      wishText.textContent = "Hãy chạm vào chiếc bình tưới nhỏ để bắt đầu tưới hoa nhé...";
      wishIcon.textContent = "💧";
      wishCount.textContent = "0";
      wishDots.forEach((d) => d.classList.remove("is-filled"));
      waterLabel.textContent = "Tưới một điều ước";
      return;
    }

    const wish = gardenWishes[currentWishIdx];
    currentWishIdx++;

    // Update wish display with animation
    wishText.style.opacity = "0";
    wishIcon.style.transform = "scale(0.5)";
    window.setTimeout(() => {
      wishText.textContent = wish.text;
      wishIcon.textContent = wish.icon;
      wishText.style.opacity = "1";
      wishIcon.style.transform = "scale(1)";
    }, 150);

    wishCount.textContent = String(currentWishIdx);
    wishDots.forEach((dot, index) => {
      dot.classList.toggle("is-filled", index < currentWishIdx);
    });

    // Progressive bloom value
    const bloomValues = [0.25, 0.52, 0.78, 1];
    interactiveGarden.style.setProperty("--bloom", String(bloomValues[currentWishIdx - 1]));

    if (currentWishIdx === gardenWishes.length) {
      waterLabel.textContent = "Đóa hoa đã nở rộ 🌸 (Tưới lại từ đầu)";
      triggerPetalShower();
      launchConfetti(80, window.innerWidth / 2, window.innerHeight * 0.6);
      playBirthdayChime();
    } else {
      waterLabel.textContent = `Tưới điều ước tiếp theo (${currentWishIdx}/4)`;
    }
  });

  // --- 8. Interactive Birthday Cake & Blowing Candles ---
  const cakeStage = document.getElementById("cakeStage");
  const interactiveCake = document.getElementById("interactiveCake");
  const blowCandleBtn = document.getElementById("blowCandleBtn");
  const birthdayToast = document.getElementById("birthdayToast");
  const blowHint = document.getElementById("blowHint");
  let isCandleBlown = false;

  const handleBlowCandle = () => {
    if (!cakeStage) return;

    if (!isCandleBlown) {
      // Blow out
      cakeStage.classList.add("candles-blown");
      isCandleBlown = true;
      if (blowCandleBtn) {
        blowCandleBtn.querySelector(".btn-icon").textContent = "✨";
        blowCandleBtn.querySelector(".btn-text").textContent = "Thắp lại ngọn nến";
      }
      if (blowHint) {
        blowHint.textContent = "Ngọn nến đã tắt cùng ngàn lời chúc dành cho Yến Nhi!";
      }

      // Audio & Confetti burst
      playBirthdayChime();
      launchConfetti(140, window.innerWidth / 2, window.innerHeight * 0.55);
      window.setTimeout(() => {
        launchConfetti(80, window.innerWidth * 0.35, window.innerHeight * 0.5);
        launchConfetti(80, window.innerWidth * 0.65, window.innerHeight * 0.5);
      }, 250);

      // Show celebration toast
      if (birthdayToast) {
        birthdayToast.classList.add("is-active");
      }
    } else {
      // Relight
      cakeStage.classList.remove("candles-blown");
      isCandleBlown = false;
      if (blowCandleBtn) {
        blowCandleBtn.querySelector(".btn-icon").textContent = "🕯️";
        blowCandleBtn.querySelector(".btn-text").textContent = "Thổi nến sinh nhật";
      }
      if (blowHint) {
        blowHint.textContent = "Chạm vào nút hoặc chiếc bánh để thổi tắt ngọn nến nhé!";
      }
      if (birthdayToast) {
        birthdayToast.classList.remove("is-active");
      }
    }
  };

  blowCandleBtn?.addEventListener("click", handleBlowCandle);
  interactiveCake?.addEventListener("click", handleBlowCandle);

  // --- 9. Star Wishes Spawner ---
  const starWishBtn = document.getElementById("starWishBtn");
  const starSpawnArea = document.getElementById("starSpawnArea");
  const starWishWords = [
    "✨ Bình an", "🌸 Hạnh phúc", "🕊️ Tự do",
    "🤍 Được thương", "🌟 Rạng rỡ", "🪴 An lành",
    "🌤️ Ấm áp", "🌷 Tự tin", "✨ Yến Nhi"
  ];

  starWishBtn?.addEventListener("click", () => {
    if (!starSpawnArea) return;
    const word = starWishWords[Math.floor(Math.random() * starWishWords.length)];
    const starEl = document.createElement("span");
    starEl.className = "floating-star";
    starEl.textContent = word;
    starEl.style.left = `${Math.random() * 70 + 15}%`;
    starEl.style.color = "#f6c867";
    starEl.style.fontFamily = "var(--font-cute)";
    starEl.style.fontSize = "15px";
    starEl.style.fontWeight = "700";
    starEl.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 80}px`);

    starSpawnArea.appendChild(starEl);
    playBirthdayChime();

    window.setTimeout(() => starEl.remove(), 2900);
  });

  // --- 10. Wax-Sealed Envelope Interaction ---
  const waxEnvelope = document.getElementById("waxEnvelope");
  const envelopeSeal = document.getElementById("envelopeSeal");

  const toggleEnvelope = () => {
    if (!waxEnvelope) return;
    const isOpened = waxEnvelope.classList.toggle("is-opened");
    envelopeSeal?.setAttribute("aria-expanded", String(isOpened));
    const paper = document.getElementById("letterPaper");
    if (paper) paper.inert = !isOpened;
    if (isOpened) {
      launchConfetti(50, window.innerWidth / 2, window.innerHeight * 0.7);
      playBirthdayChime();
      window.setTimeout(() => {
        waxEnvelope.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 250);
    }
  };

  envelopeSeal?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleEnvelope();
  });
  const birthdayPaper = document.getElementById("letterPaper");
  if (birthdayPaper) birthdayPaper.inert = true;

})();
