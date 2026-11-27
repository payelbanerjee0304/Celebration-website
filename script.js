/**
 * Welcome Baby Girl Celebration - JavaScript Application
 * Features:
 * 1. Ambient Background Canvas (Stars, Fairy Dust, Sparkles)
 * 2. High-Performance Canvas Confetti System
 * 3. Web Audio API Celestial Music Box Lullaby & Sound Chimes
 * 4. Magical Pop-Up Blessing Box:
 *    - Open gift box with smiling baby girl face on top
 *    - "Tap Box to Pop a Wish" pops the baby and the wish card on top of the box
 *    - The card sits curved half on top of the box with glassmorphism & highlight pulse
 *    - Reads all 8 hardcoded wishes directly on top of the box
 * 5. Interactive Pop Balloons with Sound & Regrowth
 * 6. Floating Hearts Generator & Mobile-Responsive Navigation
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. Preloader Handling
  // =========================================================================
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 850);
      }
    }, 450);
  });

  // =========================================================================
  // 2. Navigation, Sticky Header, & Mobile Menu
  // =========================================================================
  const siteHeader = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile menu when a nav link is clicked
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }
  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // =========================================================================
  // 3. Web Audio API Celestial Music Box (Gentle Lullaby) & Chimes
  // =========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimeout = null;
  let currentNoteIdx = 0;

  // Lullaby notes (frequency in Hz and duration in beats)
  const lullabyMelody = [
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 392.00, dur: 2.0 }, // G4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 392.00, dur: 2.0 }, // G4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 392.00, dur: 1.0 }, // G4
    { freq: 523.25, dur: 2.0 }, // C5
    { freq: 493.88, dur: 1.0 }, // B4
    { freq: 440.00, dur: 1.0 }, // A4
    { freq: 440.00, dur: 1.0 }, // A4
    { freq: 392.00, dur: 2.5 }, // G4
    { freq: 293.66, dur: 1.0 }, // D4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 349.23, dur: 2.0 }, // F4
    { freq: 293.66, dur: 1.0 }, // D4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 349.23, dur: 2.0 }, // F4
    { freq: 293.66, dur: 1.0 }, // D4
    { freq: 349.23, dur: 1.0 }, // F4
    { freq: 493.88, dur: 2.0 }, // B4
    { freq: 440.00, dur: 1.0 }, // A4
    { freq: 392.00, dur: 1.0 }, // G4
    { freq: 329.63, dur: 1.0 }, // E4
    { freq: 261.63, dur: 2.5 }, // C4
  ];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Synthesize a crystalline music box chime note
  function playMusicBoxChime(freq, durationSec) {
    if (!audioCtx || audioCtx.state !== 'running') return;
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.005, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.18, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(1.5, durationSec * 1.8));

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 2.5);
    osc2.stop(now + 2.5);
  }

  // Pop chime sound effect for surprise box & balloon clicks
  function playPopChimeSound(pitch = 520) {
    try {
      initAudioContext();
      if (!audioCtx || audioCtx.state !== 'running') return;
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 1.9, now + 0.1);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);

      setTimeout(() => {
        if (!audioCtx || audioCtx.state !== 'running') return;
        const now2 = audioCtx.currentTime;
        const chime = audioCtx.createOscillator();
        const chimeGain = audioCtx.createGain();

        chime.type = 'triangle';
        chime.frequency.setValueAtTime(pitch * 2, now2);

        chimeGain.gain.setValueAtTime(0.12, now2);
        chimeGain.exponentialRampToValueAtTime(0.0001, now2 + 0.6);

        chime.connect(chimeGain);
        chimeGain.connect(audioCtx.destination);

        chime.start(now2);
        chime.stop(now2 + 0.65);
      }, 50);
    } catch (e) {
      // Graceful fallback
    }
  }

  function stepMelody() {
    if (!isPlayingMusic) return;

    const note = lullabyMelody[currentNoteIdx];
    const beatDurationMs = 550 * note.dur;

    playMusicBoxChime(note.freq, note.dur * 0.55);

    currentNoteIdx = (currentNoteIdx + 1) % lullabyMelody.length;
    melodyTimeout = setTimeout(stepMelody, beatDurationMs);
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicLabel = document.getElementById('musicLabel');
  const musicIcon = document.getElementById('musicIcon');

  function toggleMusic() {
    initAudioContext();
    isPlayingMusic = !isPlayingMusic;

    if (isPlayingMusic) {
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('playing');
        musicLabel.textContent = 'Pause Music';
        musicIcon.textContent = '⏸️';
      }
      stepMelody();
    } else {
      if (musicToggleBtn) {
        musicToggleBtn.classList.remove('playing');
        musicLabel.textContent = 'Play Music';
        musicIcon.textContent = '🎵';
      }
      clearTimeout(melodyTimeout);
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  // =========================================================================
  // 4. Ambient Background Canvas (Stars, Fairy Dust, Sparkles)
  // =========================================================================
  const ambientCanvas = document.getElementById('ambientCanvas');
  const ambientCtx = ambientCanvas ? ambientCanvas.getContext('2d') : null;

  let ambientParticles = [];
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;

  function resizeAmbientCanvas() {
    if (!ambientCanvas) return;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    ambientCanvas.width = canvasWidth;
    ambientCanvas.height = canvasHeight;
  }
  window.addEventListener('resize', resizeAmbientCanvas);
  resizeAmbientCanvas();

  class AmbientParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * canvasWidth;
      this.y = initial ? Math.random() * canvasHeight : canvasHeight + 10;
      this.size = Math.random() * 2.8 + 1;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.opacitySpeed = (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1);

      const colors = [
        'rgba(255, 215, 0, ',
        'rgba(244, 114, 182, ',
        'rgba(192, 132, 252, ',
        'rgba(255, 255, 255, '
      ];
      this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      this.type = Math.random() > 0.7 ? 'star' : 'circle';
    }

    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.opacity += this.opacitySpeed;

      if (this.opacity > 0.85 || this.opacity < 0.15) {
        this.opacitySpeed = -this.opacitySpeed;
      }

      if (this.y < -15 || this.x < -15 || this.x > canvasWidth + 15) {
        this.reset();
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.colorBase + this.opacity + ')';
      ctx.shadowColor = this.colorBase + '0.6)';
      ctx.shadowBlur = 6;

      if (this.type === 'star') {
        ctx.beginPath();
        const r = this.size * 1.5;
        ctx.moveTo(this.x, this.y - r);
        ctx.quadraticCurveTo(this.x, this.y, this.x + r, this.y);
        ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + r);
        ctx.quadraticCurveTo(this.x, this.y, this.x - r, this.y);
        ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - r);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function initAmbientParticles() {
    const particleCount = Math.min(65, Math.floor((canvasWidth * canvasHeight) / 18000));
    ambientParticles = [];
    for (let i = 0; i < particleCount; i++) {
      ambientParticles.push(new AmbientParticle());
    }
  }
  initAmbientParticles();

  function animateAmbient() {
    if (ambientCtx) {
      ambientCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      ambientParticles.forEach(p => {
        p.update();
        p.draw(ambientCtx);
      });
    }
    requestAnimationFrame(animateAmbient);
  }
  animateAmbient();

  // =========================================================================
  // 5. High-Performance Canvas Confetti System
  // =========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  const confettiCtx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiPieces = [];

  function resizeConfettiCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  const confettiColors = [
    '#f472b6', '#ec4899', '#db2777',
    '#c084fc', '#a855f7', '#d8b4fe',
    '#ffd700', '#fde047', '#f59e0b',
    '#ffffff', '#fff0f5', '#fed7aa'
  ];

  class ConfettiPiece {
    constructor(originX, originY) {
      this.x = originX !== undefined ? originX : Math.random() * window.innerWidth;
      this.y = originY !== undefined ? originY : -20;
      this.size = Math.random() * 9 + 6;
      this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = originY !== undefined ? Math.sin(angle) * speed - 6 : Math.random() * 3 + 2;

      this.gravity = 0.22;
      this.drag = 0.985;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = (Math.random() - 0.5) * 8;
      this.opacity = 1;
      this.isHeart = Math.random() > 0.65;
    }

    update() {
      this.vx *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.y > window.innerHeight * 0.7) {
        this.opacity -= 0.015;
      }
    }

    draw(ctx) {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.fillStyle = this.color;

      if (this.isHeart) {
        const s = this.size * 0.6;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.4);
        ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.2, s * 0.5, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.5, 0, s * 0.4);
        ctx.fill();
      } else {
        ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size * 0.6);
      }
      ctx.restore();
    }
  }

  function launchConfetti(originX, originY, count = 80) {
    for (let i = 0; i < count; i++) {
      confettiPieces.push(new ConfettiPiece(originX, originY));
    }
  }

  function animateConfetti() {
    if (confettiCtx) {
      confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = confettiPieces.length - 1; i >= 0; i--) {
        const piece = confettiPieces[i];
        piece.update();
        piece.draw(confettiCtx);

        if (piece.y > window.innerHeight + 40 || piece.opacity <= 0) {
          confettiPieces.splice(i, 1);
        }
      }
    }
    requestAnimationFrame(animateConfetti);
  }
  animateConfetti();

  // =========================================================================
  // 6. Floating Hearts Generator
  // =========================================================================
  const heartIcons = ['💖', '💕', '💗', '🌸', '✨', '👑', '🦋', '🧸'];

  function spawnFloatingHeart(customX, customY) {
    const heart = document.createElement('div');
    heart.className = 'spawned-heart';
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];

    const startX = customX !== undefined ? customX : Math.random() * (window.innerWidth - 60) + 30;
    const startY = customY !== undefined ? customY : window.innerHeight - 80;

    const size = Math.random() * 1.2 + 1.2;
    const driftX = (Math.random() - 0.5) * 140;

    heart.style.left = `${startX}px`;
    heart.style.top = `${startY}px`;
    heart.style.fontSize = `${size}rem`;
    heart.style.setProperty('--drift-x', `${driftX}px`);

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 3200);
  }

  function showerHeartsBatch(amount = 18) {
    for (let i = 0; i < amount; i++) {
      setTimeout(() => {
        spawnFloatingHeart();
      }, i * 90);
    }
  }

  // =========================================================================
  // 6. Celebration Floating Action Dock (Confetti, Balloons, Hearts)
  // =========================================================================
  const fabShowerLove = document.getElementById('fabShowerLove');
  if (fabShowerLove) {
    fabShowerLove.addEventListener('click', () => {
      const rect = fabShowerLove.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 50);
      showerHeartsBatch(20);
      playPopChimeSound(560);
    });
  }

  const fabConfetti = document.getElementById('fabConfetti');
  if (fabConfetti) {
    fabConfetti.addEventListener('click', () => {
      const rect = fabConfetti.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 90);
      launchConfetti(window.innerWidth * 0.2, window.innerHeight * 0.45, 55);
      launchConfetti(window.innerWidth * 0.8, window.innerHeight * 0.45, 55);
      playPopChimeSound(640);
    });
  }

  const fabBalloons = document.getElementById('fabBalloons');
  if (fabBalloons) {
    fabBalloons.addEventListener('click', () => {
      playPopChimeSound(480);
      setTimeout(() => playPopChimeSound(640), 140);

      // Launch an organic bouquet of 6 balloons spread across the screen
      const positions = [10, 26, 42, 58, 74, 90];
      // Randomize position order slightly so they don't emerge in a strict line
      positions.sort(() => Math.random() - 0.5);

      positions.forEach((pos, idx) => {
        setTimeout(() => {
          createAmbientBalloon(true, pos + (Math.random() * 6 - 3));
        }, idx * 150);
      });
    });
  }

  // Hero Shower Button
  const showerLoveHeroBtn = document.getElementById('showerLoveHeroBtn');
  if (showerLoveHeroBtn) {
    showerLoveHeroBtn.addEventListener('click', () => {
      const rect = showerLoveHeroBtn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 50);
      showerHeartsBatch(22);
      playPopChimeSound(520);
    });
  }

  // Hero Arrival Badge (Interactive Date & Time Milestone celebration)
  const heroArrivalBadge = document.getElementById('heroArrivalBadge');
  if (heroArrivalBadge) {
    const triggerArrivalCelebration = (e) => {
      const rect = heroArrivalBadge.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      launchConfetti(centerX, centerY, 35);
      spawnFloatingHeart(centerX, centerY);
      playPopChimeSound(587.33); // D5
      setTimeout(() => playPopChimeSound(880), 120); // A5
    };
    heroArrivalBadge.addEventListener('click', triggerArrivalCelebration);
    heroArrivalBadge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerArrivalCelebration(e);
      }
    });
  }

  // =========================================================================
  // 7. Enter Celebration Button (Scroll + Confetti Cannon)
  // =========================================================================
  const enterCelebrationBtn = document.getElementById('enterCelebrationBtn');
  if (enterCelebrationBtn) {
    enterCelebrationBtn.addEventListener('click', () => {
      const rect = enterCelebrationBtn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 90);
      showerHeartsBatch(15);

      if (!isPlayingMusic) {
        toggleMusic();
      }

      for (let i = 0; i < 3; i++) {
        setTimeout(() => createAmbientBalloon(true), i * 300);
      }

      const targetSection = document.getElementById('beginning');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // =========================================================================
  // 8. Ambient Celebration Balloons Floating Throughout the Website
  // =========================================================================
  const ambientBalloonsLayer = document.getElementById('ambientBalloonsLayer');
  const balloonThemes = ['pink', 'lavender', 'gold', 'cream', 'rose'];
  const balloonIcons = ['✨', '🌸', '⭐', '💖', '👑', '🎀'];

  function createAmbientBalloon(isUserTriggered = false, forcedLeftPercent = null) {
    if (!ambientBalloonsLayer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'ambient-balloon-wrapper';

    const balloon = document.createElement('div');
    const theme = balloonThemes[Math.floor(Math.random() * balloonThemes.length)];
    const icon = balloonIcons[Math.floor(Math.random() * balloonIcons.length)];

    balloon.className = `balloon balloon-${theme} ambient-balloon-inner`;
    balloon.title = 'Click to pop me! ✨';
    balloon.setAttribute('role', 'button');
    balloon.setAttribute('tabindex', '0');
    balloon.setAttribute('aria-label', `Celebration balloon, tap to pop`);
    balloon.innerHTML = `
      <div class="balloon-string"></div>
      <span class="balloon-sparkle">${icon}</span>
    `;

    // Position along margins or across the viewport
    let leftPercent;
    if (forcedLeftPercent !== null && !isNaN(forcedLeftPercent)) {
      leftPercent = Math.max(4, Math.min(94, forcedLeftPercent));
    } else if (isUserTriggered) {
      leftPercent = Math.random() * 80 + 10;
    } else {
      // Float along margins (left 2-18% or right 82-96%) to frame the content
      leftPercent = Math.random() > 0.5
        ? Math.random() * 16 + 2
        : Math.random() * 14 + 82;
    }

    // Balloon flight duration: brisk & festive (5.5s - 7.5s) on user trigger, serene (7.5s - 10s) on ambient
    const duration = isUserTriggered
      ? (Math.random() * 2 + 5.5)
      : (Math.random() * 2.5 + 7.5);
    const scale = Math.random() * 0.22 + 0.9;

    wrapper.style.left = `${leftPercent}%`;
    wrapper.style.animationDuration = `${duration.toFixed(2)}s`;
    balloon.style.setProperty('--balloon-scale', scale);

    wrapper.appendChild(balloon);
    ambientBalloonsLayer.appendChild(wrapper);

    // Interactive Pop on Click or Keydown
    const popBalloon = (e) => {
      e.stopPropagation();
      if (balloon.classList.contains('balloon-popping')) return;
      balloon.classList.add('balloon-popping');

      playPopChimeSound(520);

      const rect = balloon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      launchConfetti(centerX, centerY, 35);
      spawnFloatingHeart(centerX, centerY);

      setTimeout(() => {
        if (wrapper.parentNode) {
          wrapper.remove();
        }
      }, 260);
    };

    balloon.addEventListener('click', popBalloon);
    balloon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        popBalloon(e);
      }
    });

    // Auto-remove when it finishes floating
    setTimeout(() => {
      if (wrapper.parentNode) {
        wrapper.remove();
      }
    }, (duration + 0.5) * 1000);
  }

  // Periodic ambient balloon release (keeps celebration alive throughout the website)
  setInterval(() => {
    if (!document.hidden && ambientBalloonsLayer && ambientBalloonsLayer.childElementCount < 5) {
      createAmbientBalloon(false);
    }
  }, 7500);

  // Initial ambient balloons after page loads
  setTimeout(() => {
    createAmbientBalloon(false);
    setTimeout(() => createAmbientBalloon(false), 2400);
  }, 1200);

  // =========================================================================
  // 9. Parents & Father Tribute Buttons
  // =========================================================================
  const parentsBlessingBtn = document.getElementById('parentsBlessingBtn');
  if (parentsBlessingBtn) {
    parentsBlessingBtn.addEventListener('click', () => {
      const rect = parentsBlessingBtn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 70);
      showerHeartsBatch(20);
      playPopChimeSound(560);
      setTimeout(() => playPopChimeSound(720), 160);
    });
  }

  const fatherLoveBtn = document.getElementById('fatherLoveBtn');
  if (fatherLoveBtn) {
    fatherLoveBtn.addEventListener('click', () => {
      const rect = fatherLoveBtn.getBoundingClientRect();
      launchConfetti(rect.left + rect.width / 2, rect.top, 70);
      showerHeartsBatch(20);
      playPopChimeSound(580);
      setTimeout(() => playPopChimeSound(760), 160);
    });
  }

  // =========================================================================
  // 10. Magical Pop-Up Blessing Box: 7 Blessings in a Semicircular Arc
  //     & Interactive Gift Box Opening Ceremony
  // =========================================================================
  const eightBlessings = [
    {
      id: 1,
      sender: "Barnali Patra",
      title: "Barnali Patra",
      theme: "Endless Blessings",
      icon: "👼",
      badge: "Wish 1 of 8 • Barnali Patra",
      text: "Welcome to the world Little One 👼 May God bless you with a healthy, happy and beautiful life. your little world always be filled with love and endless blessings ❤"
    },
    {
      id: 2,
      sender: "Sangita Satpathy",
      title: "Sangita Satpathy",
      theme: "Little Angel",
      icon: "🌸",
      badge: "Wish 2 of 8 • Sangita Satpathy",
      text: "Welcome to the world, little angel ❤ May your tiny feet walk towards a lifetime happiness 🤗"
    },
    {
      id: 3,
      sender: "Suvadeep",
      title: "Suvadeep (শুভদীপ)",
      theme: "পুঁচকি লক্ষ্মী",
      icon: "💖",
      badge: "Wish 3 of 8 • Suvadeep",
      text: "সৌনক দা, তোমার পুঁচকি লক্ষ্মীটার জন্য আমার তরফ থেকে রইল অনেক অনেক ভালোবাসা, আদর আর শুভকামনা। ❤"
    },
    {
      id: 4,
      sender: "Disha Chakraborty",
      title: "Disha Chakraborty",
      theme: "Grandest Joy",
      icon: "⭐",
      badge: "Wish 4 of 8 • Disha Chakraborty",
      text: "The tiniest arrival, the grandest joy, the sweetest new chapter. 💖"
    },
    {
      id: 5,
      sender: "Maulik Sheth",
      title: "Maulik Sheth",
      theme: "Adding Blessings",
      icon: "🌟",
      badge: "Wish 5 of 8 • Maulik Sheth",
      text: "Congratulations on adding blessings to your life. ✨"
    },
    {
      id: 6,
      sender: "Moumi",
      title: "Moumi",
      theme: "Welcome to Our Zone",
      icon: "👑",
      badge: "Wish 6 of 8 • Moumi",
      text: "Hey! little princess welcome to our zone 😍. May God Bless You & have a great life ✨"
    },
    {
      id: 7,
      sender: "Dipti",
      title: "Dɪᴘᴛɪ",
      theme: "Little Blossom",
      icon: "🌷",
      badge: "Wish 7 of 8 • Dipti",
      text: "The world just got a little sweeter. Welcome, little blossom! 🌷 May your tiny world always be filled with love & magic. 🎀 💗"
    },
    {
      id: 8,
      sender: "Payel",
      title: "Payel",
      theme: "Little Butterfly",
      icon: "🦋",
      badge: "Wish 8 of 8 • Payel",
      text: "Hello, little butterfly! 🦋 May you always cherish God's beautiful creations, embrace the goodness, and never let the world's ugliness dim your innocent light. 🦋✨"
    }
  ];

  // Alias for backward compatibility if referenced elsewhere
  const sevenBlessings = eightBlessings;

  let isBoxOpen = false;

  // DOM Elements
  const blessingsStage = document.getElementById('blessingsStage');
  const magicalGiftBox = document.getElementById('magicalGiftBox');
  const boxOpenInstruction = document.getElementById('boxOpenInstruction');
  const replayBlessingsBtn = document.getElementById('replayBlessingsBtn');
  const arcCards = document.querySelectorAll('.blessing-arc-card');

  // Modal DOM Elements
  const blessingModal = document.getElementById('blessingModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalActionCloseBtn = document.getElementById('modalActionCloseBtn');
  const modalBlessingIcon = document.getElementById('modalBlessingIcon');
  const modalBlessingBadge = document.getElementById('modalBlessingBadge');
  const modalBlessingTitle = document.getElementById('modalBlessingTitle');
  const modalBlessingText = document.getElementById('modalBlessingText');

  /**
   * Open the Magical Gift Box:
   * 1. Opens lid with 3D animation
   * 2. Radiates golden light rays
   * 3. Baby princess pops up and floats gently
   * 4. Balloons burst and float up out of the box
   * 5. 7 blessing cards bloom into the semicircular upper arc
   * 6. Confetti, floating hearts, and musical chimes burst forth!
   */
  function openMagicalGiftBox() {
    if (isBoxOpen) return;
    isBoxOpen = true;

    // Trigger visual state
    if (blessingsStage) {
      blessingsStage.classList.add('box-opened');
    }

    // Update instruction text and box title
    if (boxOpenInstruction) {
      const textEl = boxOpenInstruction.querySelector('.instruction-text');
      if (textEl) textEl.textContent = 'Tap the box to close!';
    }
    if (magicalGiftBox) {
      magicalGiftBox.setAttribute('title', 'Click or tap to close the gift box!');
      magicalGiftBox.setAttribute('aria-label', 'Close the magical gift box');
    }

    // Play sparkling chime sound
    playPopChimeSound(560);
    setTimeout(() => { playPopChimeSound(700); }, 150);
    setTimeout(() => { playPopChimeSound(840); }, 320);

    // Confetti cannon & heart bursts from the box center
    if (magicalGiftBox) {
      const rect = magicalGiftBox.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height * 0.35;
      launchConfetti(centerX, centerY, 80);
      showerHeartsBatch(14);

      // Second celebratory burst as cards finish settling
      setTimeout(() => {
        launchConfetti(centerX - 180, centerY - 80, 35);
        launchConfetti(centerX + 180, centerY - 80, 35);
      }, 700);
    }
  }

  /**
   * Close the Magical Gift Box:
   * 1. Closes lid smoothly with 3D animation
   * 2. Baby princess and cards retreat back inside
   * 3. Balloons are cleared
   * 4. Instruction text and box titles reset
   */
  function closeMagicalGiftBox() {
    closeBlessingModal();
    isBoxOpen = false;

    if (blessingsStage) {
      blessingsStage.classList.remove('box-opened');
    }

    // Update instruction text and box title
    if (boxOpenInstruction) {
      const textEl = boxOpenInstruction.querySelector('.instruction-text');
      if (textEl) textEl.textContent = 'Tap the box to reveal the blessings!';
    }
    if (magicalGiftBox) {
      magicalGiftBox.setAttribute('title', 'Click or tap to open the gift box!');
      magicalGiftBox.setAttribute('aria-label', 'Open the magical gift box');
    }

    // Soft click closing chime
    playPopChimeSound(420);
  }

  /**
   * Toggle Gift Box: 1st click opens, 2nd click closes!
   */
  function toggleMagicalGiftBox() {
    if (isBoxOpen) {
      closeMagicalGiftBox();
    } else {
      openMagicalGiftBox();
    }
  }

  /**
   * Replay animation: closes the box, resets cards, balloons, and re-opens smoothly
   */
  function replayBlessingsAnimation() {
    closeMagicalGiftBox();

    // Scroll smoothly to keep the box visible
    if (blessingsStage) {
      blessingsStage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Re-open with fresh ceremony after brief closing reset
    setTimeout(() => {
      openMagicalGiftBox();
    }, 450);
  }

  /**
   * Display Complete Blessing in the Popup Modal
   */
  function openBlessingModal(index) {
    if (index < 0 || index >= eightBlessings.length) return;
    const blessing = eightBlessings[index];

    if (modalBlessingIcon) modalBlessingIcon.textContent = blessing.icon;
    if (modalBlessingBadge) modalBlessingBadge.textContent = blessing.badge;
    if (modalBlessingTitle) modalBlessingTitle.textContent = blessing.theme;
    if (modalBlessingText) modalBlessingText.textContent = blessing.text;

    if (blessingModal) {
      blessingModal.classList.add('open');
      blessingModal.setAttribute('aria-hidden', 'false');
    }

    // Gentle pop sound
    playPopChimeSound(620);

    // Spawn sparkles at click
    showerHeartsBatch(4);
  }

  /**
   * Close the Blessing Modal
   */
  function closeBlessingModal() {
    if (blessingModal) {
      blessingModal.classList.remove('open');
      blessingModal.setAttribute('aria-hidden', 'true');
    }
  }

  // Event Listeners for Toggling the Box (1st Click Opens, 2nd Click Closes)
  if (magicalGiftBox) {
    magicalGiftBox.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMagicalGiftBox();
    });

    magicalGiftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMagicalGiftBox();
      }
    });
  }

  if (boxOpenInstruction) {
    boxOpenInstruction.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMagicalGiftBox();
    });

    boxOpenInstruction.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMagicalGiftBox();
      }
    });
  }

  // Replay Button
  if (replayBlessingsBtn) {
    replayBlessingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      replayBlessingsAnimation();
    });
  }

  // Blessing Arc Cards Click to Open Modal
  arcCards.forEach((card) => {
    const handleCardTrigger = () => {
      if (!isBoxOpen) {
        openMagicalGiftBox();
        return;
      }
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openBlessingModal(idx);
    };

    card.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCardTrigger();
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleCardTrigger();
      }
    });
  });

  // Modal Close Events for Blessing Modal
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeBlessingModal);
  }

  if (modalActionCloseBtn) {
    modalActionCloseBtn.addEventListener('click', closeBlessingModal);
  }

  if (blessingModal) {
    blessingModal.addEventListener('click', (e) => {
      if (e.target === blessingModal) {
        closeBlessingModal();
      }
    });
  }

  // =========================================================================
  // 11. Image Lightbox Modal: Click Picture to Open Bigger Picture View
  // =========================================================================
  const imageLightboxModal = document.getElementById('imageLightboxModal');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxActionCloseBtn = document.getElementById('lightboxActionCloseBtn');
  const lightboxFullImg = document.getElementById('lightboxFullImg');
  const lightboxImageTitle = document.getElementById('lightboxImageTitle');
  const lightboxImageDesc = document.getElementById('lightboxImageDesc');
  const parentsCaricatureFrame = document.getElementById('parentsCaricatureFrame');
  const parentsCaricatureImg = document.getElementById('parentsCaricatureImg');

  /**
   * Open Image Lightbox / Modal for Bigger Picture
   */
  function openImageLightbox(imageSrc, imageAlt, titleText, descText) {
    if (!imageLightboxModal) return;

    if (lightboxFullImg) {
      lightboxFullImg.src = imageSrc || 'assets/parents_caricature.jpg';
      lightboxFullImg.alt = imageAlt || 'Mommy, Daddy & Princess Srinika';
    }
    if (lightboxImageTitle && titleText) {
      lightboxImageTitle.textContent = titleText;
    }
    if (lightboxImageDesc && descText) {
      lightboxImageDesc.textContent = descText;
    }

    imageLightboxModal.classList.add('open');
    imageLightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Play sparkling chime sound & shower tiny celebration hearts
    playPopChimeSound(680);
    showerHeartsBatch(4);
  }

  /**
   * Close Image Lightbox
   */
  function closeImageLightbox() {
    if (!imageLightboxModal) return;
    imageLightboxModal.classList.remove('open');
    imageLightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    playPopChimeSound(450);
  }

  // Event Listeners for Opening the Bigger Picture
  if (parentsCaricatureFrame) {
    parentsCaricatureFrame.addEventListener('click', (e) => {
      e.preventDefault();
      openImageLightbox(
        'assets/parents_caricature.jpg',
        'Heartwarming caricature illustration of Sounak and his wife holding their baby girl Srinika',
        'Mommy, Daddy & Princess Srinika',
        'A beautiful new beginning filled with infinite love, sweet lullabies, and endless blessings.'
      );
    });

    parentsCaricatureFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        parentsCaricatureFrame.click();
      }
    });
  }

  if (parentsCaricatureImg && !parentsCaricatureFrame) {
    parentsCaricatureImg.addEventListener('click', (e) => {
      e.preventDefault();
      openImageLightbox(
        parentsCaricatureImg.src,
        parentsCaricatureImg.alt,
        'Mommy, Daddy & Princess Srinika',
        'A beautiful new beginning filled with infinite love, sweet lullabies, and endless blessings.'
      );
    });
  }

  // Lightbox Close Handlers
  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeImageLightbox();
    });
  }

  if (lightboxActionCloseBtn) {
    lightboxActionCloseBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeImageLightbox();
    });
  }

  if (imageLightboxModal) {
    imageLightboxModal.addEventListener('click', (e) => {
      if (e.target === imageLightboxModal) {
        closeImageLightbox();
      }
    });
  }

  // =========================================================================
  // Crawling Baby Princess Interaction (Tap to Giggle & Sparkle)
  // =========================================================================
  const crawlingBabyChar = document.getElementById('crawlingBabyChar');
  const babySpeechBubble = document.getElementById('babySpeechBubble');
  if (crawlingBabyChar) {
    const babyGiggles = [
      'Giggle! 👶💖',
      'Peekaboo! ✨',
      'I am Srinika! 👑',
      'Hehe! 🌸',
      'Coo coo! 💕',
      'Princess Srinika! 👑',
      'Sweet Baby! 🎀'
    ];
    let bubbleTimeout;

    const playBabyGiggle = (e) => {
      e.stopPropagation();
      playPopChimeSound(680);
      setTimeout(() => playPopChimeSound(850), 120);

      const rect = crawlingBabyChar.getBoundingClientRect();
      const walker = document.getElementById('crawlingBabyWalker');

      // Detect whether the baby is currently crawling towards the right or left (scaleX(-1))
      let isFacingLeft = false;
      if (walker) {
        const tr = window.getComputedStyle(walker).transform;
        if (tr && tr !== 'none') {
          const match = tr.match(/matrix\(([^,]+)/);
          if (match && parseFloat(match[1]) < 0) {
            isFacingLeft = true;
          }
        }
      }

      // When facing right, head is near the right side of the body (~70% width).
      // When facing left, head is near the left side of the body (~30% width).
      const headCenterX = isFacingLeft ? (rect.left + rect.width * 0.32) : (rect.left + rect.width * 0.68);
      const headTopY = rect.top;

      launchConfetti(headCenterX, headTopY, 18);
      spawnFloatingHeart(headCenterX, headTopY);

      if (babySpeechBubble) {
        babySpeechBubble.style.left = `${headCenterX}px`;
        babySpeechBubble.style.top = `${headTopY - 14}px`;
        babySpeechBubble.textContent = babyGiggles[Math.floor(Math.random() * babyGiggles.length)];
        babySpeechBubble.classList.add('visible');
        clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
          babySpeechBubble.classList.remove('visible');
        }, 1800);
      }
    };

    crawlingBabyChar.addEventListener('click', playBabyGiggle);
    crawlingBabyChar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playBabyGiggle(e);
      }
    });
  }

  // Keyboard accessibility: ESC closes both blessingModal and imageLightboxModal
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (imageLightboxModal && imageLightboxModal.classList.contains('open')) {
        closeImageLightbox();
      }
      if (blessingModal && blessingModal.classList.contains('open')) {
        closeBlessingModal();
      }
    }
  });

})();
