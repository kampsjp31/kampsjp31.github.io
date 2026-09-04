// JavaScript Document
(function () {
  "use strict";

  // ============================================
  // BRISKET SCREENSAVER SETTINGS
  // ============================================

  const IDLE_TIME = 60 * 1000; // 60 seconds
  const BRISKET_SIZE = 280;    // pixels
  const SPEED = 0.35;          // lower = slower
  const FADE_TIME = 2500;      // fade in/out in milliseconds

  // Location of your brisket image
  const BRISKET_IMAGE = "/images/brisket.png";


  // ============================================
  // CREATE THE SCREENSAVER
  // ============================================

  const container = document.createElement("div");
  container.id = "brisket-screensaver";

  const brisket = document.createElement("img");
  brisket.src = BRISKET_IMAGE;
  brisket.alt = "";
  brisket.draggable = false;

  container.appendChild(brisket);
  document.body.appendChild(container);


  // ============================================
  // ADD CSS
  // ============================================

  const style = document.createElement("style");

  style.textContent = `
    #brisket-screensaver {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;

      z-index: 999999;

      pointer-events: none;

      opacity: 0;
      visibility: hidden;

      transition:
        opacity ${FADE_TIME}ms ease,
        visibility ${FADE_TIME}ms ease;

      overflow: hidden;
    }

    #brisket-screensaver.active {
      opacity: 1;
      visibility: visible;
    }

    #brisket-screensaver img {
      position: absolute;

      width: ${BRISKET_SIZE}px;
      height: auto;

      left: 0;
      top: 0;

      user-select: none;
      -webkit-user-drag: none;

      will-change: transform;

      filter:
        drop-shadow(0 12px 18px rgba(0,0,0,0.35));
    }

    @media (max-width: 600px) {
      #brisket-screensaver img {
        width: 180px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #brisket-screensaver {
        display: none !important;
      }
    }
  `;

  document.head.appendChild(style);


  // ============================================
  // ANIMATION VARIABLES
  // ============================================

  let x = 100;
  let y = 100;

  let velocityX = SPEED;
  let velocityY = SPEED * 0.8;

  let rotation = 0;
  let rotationSpeed = 0.015;

  let animationFrame = null;
  let idleTimer = null;
  let active = false;


  // ============================================
  // SHOW BRISKET
  // ============================================

  function showScreensaver() {

    if (active) return;

    active = true;

    // Start at a random location
    const maxX = window.innerWidth - brisket.offsetWidth;
    const maxY = window.innerHeight - brisket.offsetHeight;

    x = Math.random() * Math.max(0, maxX);
    y = Math.random() * Math.max(0, maxY);

    // Random direction
    velocityX =
      (Math.random() > 0.5 ? 1 : -1) * SPEED;

    velocityY =
      (Math.random() > 0.5 ? 1 : -1) * SPEED * 0.8;

    rotation = Math.random() * 10 - 5;

    brisket.style.transform =
      `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;

    container.classList.add("active");

    animate();
  }


  // ============================================
  // HIDE BRISKET
  // ============================================

  function hideScreensaver() {

    if (!active) return;

    active = false;

    container.classList.remove("active");

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }


  // ============================================
  // MOVE BRISKET
  // ============================================

  function animate() {

    if (!active) return;

    const maxX =
      window.innerWidth - brisket.offsetWidth;

    const maxY =
      window.innerHeight - brisket.offsetHeight;


    x += velocityX;
    y += velocityY;

    rotation += rotationSpeed;


    // Bounce left/right
    if (x <= 0 || x >= maxX) {

      velocityX *= -1;

      x = Math.max(0, Math.min(x, maxX));

      // Slightly change rotation
      rotationSpeed *= -1;
    }


    // Bounce top/bottom
    if (y <= 0 || y >= maxY) {

      velocityY *= -1;

      y = Math.max(0, Math.min(y, maxY));

      rotationSpeed *= -1;
    }


    brisket.style.transform =
      `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg)`;


    animationFrame =
      requestAnimationFrame(animate);
  }


  // ============================================
  // RESET INACTIVITY TIMER
  // ============================================

  function resetIdleTimer() {

    hideScreensaver();

    clearTimeout(idleTimer);

    idleTimer = setTimeout(
      showScreensaver,
      IDLE_TIME
    );
  }


  // ============================================
  // USER ACTIVITY
  // ============================================

  const activityEvents = [
    "mousemove",
    "mousedown",
    "keydown",
    "scroll",
    "wheel",
    "touchstart",
    "touchmove",
    "pointerdown"
  ];


  activityEvents.forEach(function (eventName) {

    document.addEventListener(
      eventName,
      resetIdleTimer,
      {
        passive: true
      }
    );

  });


  // ============================================
  // WINDOW RESIZE
  // ============================================

  window.addEventListener("resize", function () {

    if (!active) return;

    const maxX =
      window.innerWidth - brisket.offsetWidth;

    const maxY =
      window.innerHeight - brisket.offsetHeight;

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

  });


  // ============================================
  // START
  // ============================================

  resetIdleTimer();

})();