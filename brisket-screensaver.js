(function () {
    "use strict";

    // ==========================================
    // SETTINGS
    // ==========================================

    const IDLE_TIME = 5 * 1000; // 60 seconds
    const BRISKET_SIZE = 280;    // pixels
    const SPEED = 0.4;           // movement speed


    // ==========================================
    // WAIT UNTIL PAGE IS READY
    // ==========================================

    function startBrisketScreensaver() {

        // Don't accidentally create it twice
        if (document.getElementById("brisket-screensaver")) {
            return;
        }


        // ======================================
        // CREATE HTML
        // ======================================

        const container = document.createElement("div");
        container.id = "brisket-screensaver";

        const brisket = document.createElement("img");

        brisket.src = "images/brisket.png";
        brisket.alt = "";
        brisket.draggable = false;

        container.appendChild(brisket);
        document.body.appendChild(container);


        // ======================================
        // CREATE CSS
        // ======================================

        const style = document.createElement("style");

        style.textContent = `
            #brisket-screensaver {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;

                z-index: 2147483647;

                pointer-events: none;

                opacity: 0;
                visibility: hidden;

                transition:
                    opacity 2s ease,
                    visibility 2s ease;

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

                display: block;

                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;

                filter: drop-shadow(
                    0 10px 15px rgba(0,0,0,0.35)
                );
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


        // ======================================
        // VARIABLES
        // ======================================

        let x = 100;
        let y = 100;

        let vx = SPEED;
        let vy = SPEED * 0.75;

        let rotation = 0;
        let rotationDirection = 1;

        let animationFrame = null;
        let idleTimer = null;

        let active = false;


        // ======================================
        // SHOW BRISKET
        // ======================================

        function showBrisket() {

            if (active) return;

            active = true;

            // Random starting position
            const maxX =
                Math.max(0, window.innerWidth - brisket.offsetWidth);

            const maxY =
                Math.max(0, window.innerHeight - brisket.offsetHeight);

            x = Math.random() * maxX;
            y = Math.random() * maxY;

            // Random direction
            vx = (Math.random() > 0.5 ? 1 : -1) * SPEED;
            vy = (Math.random() > 0.5 ? 1 : -1) * SPEED * 0.75;

            container.classList.add("active");

            animate();
        }


        // ======================================
        // HIDE BRISKET
        // ======================================

        function hideBrisket() {

            active = false;

            container.classList.remove("active");

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }


        // ======================================
        // ANIMATE
        // ======================================

        function animate() {

            if (!active) return;

            const maxX =
                Math.max(0, window.innerWidth - brisket.offsetWidth);

            const maxY =
                Math.max(0, window.innerHeight - brisket.offsetHeight);


            x += vx;
            y += vy;

            rotation += 0.03 * rotationDirection;


            // LEFT / RIGHT
            if (x <= 0) {
                x = 0;
                vx = Math.abs(vx);
                rotationDirection *= -1;
            }

            if (x >= maxX) {
                x = maxX;
                vx = -Math.abs(vx);
                rotationDirection *= -1;
            }


            // TOP / BOTTOM
            if (y <= 0) {
                y = 0;
                vy = Math.abs(vy);
                rotationDirection *= -1;
            }

            if (y >= maxY) {
                y = maxY;
                vy = -Math.abs(vy);
                rotationDirection *= -1;
            }


            brisket.style.transform =
                `translate(${x}px, ${y}px) rotate(${rotation}deg)`;


            animationFrame =
                requestAnimationFrame(animate);
        }


        // ======================================
        // RESET TIMER
        // ======================================

        function resetTimer() {

            hideBrisket();

            clearTimeout(idleTimer);

            idleTimer = setTimeout(
                showBrisket,
                IDLE_TIME
            );
        }


        // ======================================
        // USER ACTIVITY
        // ======================================

        const events = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "wheel",
            "touchstart",
            "touchmove",
            "pointerdown"
        ];

        events.forEach(function (event) {

            document.addEventListener(
                event,
                resetTimer,
                { passive: true }
            );

        });


        // ======================================
        // WINDOW RESIZE
        // ======================================

        window.addEventListener("resize", function () {

            if (!active) return;

            const maxX =
                Math.max(0, window.innerWidth - brisket.offsetWidth);

            const maxY =
                Math.max(0, window.innerHeight - brisket.offsetHeight);

            x = Math.min(x, maxX);
            y = Math.min(y, maxY);

        });


        // ======================================
        // START THE TIMER
        // ======================================

        resetTimer();

    }


    // ==========================================
    // START AFTER PAGE LOAD
    // ==========================================

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            startBrisketScreensaver
        );

    } else {

        startBrisketScreensaver();

    }

})();