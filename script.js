document.addEventListener("DOMContentLoaded", () => {
    // ====== Personaliza aquí ======
    const HER_NAME = "Gaby";

    // ⚠️ Fotos: súbelas a /assets/photos/ y agrega rutas aquí
    const PHOTO_URLS = [
        "assets/photos/gaby1.jpg",
        "assets/photos/gaby2.jpg",
        "assets/photos/gaby3.jpg",
    ];

    const PHOTO_CAPTIONS = [
        "No es solo que te veas linda… es que tienes esa calma que te hace imposible de ignorar.",
        "Hay miradas que se ven… y otras que se sienten. La tuya es de las segundas.",
        "Esto suena atrevido, pero fino: contigo dan ganas de conocerte en serio, no solo mirarte.",
        "No sé si lo sabes… pero tu vibra se queda más de lo normal.",
        "Si esto te saca una sonrisita, ya valió la pena hacer todo esto."
    ];

    // ====== DOM ======
    const card = document.getElementById("card");
    const content = document.getElementById("content");
    const tag = document.getElementById("tag");
    const meterFill = document.getElementById("meterFill");
    const meterText = document.getElementById("meterText");
    const footerMini = document.getElementById("footerMini");

    const signature = document.getElementById("signature");
    const sigMeta = document.getElementById("sigMeta");

    // ====== Audio toggle (opcional) ======
    const bgm = document.getElementById("bgm");
    const soundBtn = document.getElementById("soundBtn");
    let soundOn = false;

    function setSoundUI() {
        soundBtn.textContent = soundOn ? "🔊" : "🔇";
    }
    setSoundUI();

    async function toggleSound() {
        // Nota: el audio SOLO puede iniciar con gesto del usuario
        soundOn = !soundOn;
        setSoundUI();

        if (!bgm || !bgm.src && bgm.children.length === 0) return; // si no cargaste audio, no hace nada

        try {
            if (soundOn) {
                bgm.volume = 0.28; // suave
                await bgm.play();
            } else {
                bgm.pause();
            }
        } catch {
            // si el navegador bloquea autoplay, no pasa nada
            soundOn = false;
            setSoundUI();
        }
    }

    soundBtn.addEventListener("click", toggleSound);

    // ====== Parallax suave ======
    const root = document.documentElement;
    let lastPX = 0, lastPY = 0;

    function setParallax(px, py) {
        lastPX += (px - lastPX) * 0.18;
        lastPY += (py - lastPY) * 0.18;
        root.style.setProperty("--px", `${lastPX}px`);
        root.style.setProperty("--py", `${lastPY}px`);
    }

    window.addEventListener("pointermove", (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        setParallax(dx * 18, dy * 18);
    }, { passive: true });

    // ====== FX Canvas ======
    const fx = document.getElementById("fx");
    const ctx = fx.getContext("2d", { alpha: true });
    let W = 0, H = 0, dpr = 1;
    let particles = [];

    function resize() {
        dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        W = window.innerWidth; H = window.innerHeight;
        fx.width = Math.floor(W * dpr);
        fx.height = Math.floor(H * dpr);
        fx.style.width = W + "px";
        fx.style.height = H + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    function rand(a, b) { return a + Math.random() * (b - a); }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function burst(x, y, power = 1) {
        const n = Math.floor(18 * power);
        for (let i = 0; i < n; i++) {
            particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 4.2 * power,
                vy: (Math.random() - 0.9) * 4.2 * power,
                g: 0.08 + Math.random() * 0.08,
                life: rand(42, 78),
                size: rand(10, 18),
                rot: rand(-0.2, 0.2),
                kind: Math.random() < 0.55 ? "heart" : "spark"
            });
        }
    }

    function drawHeart(s) {
        ctx.beginPath();
        const t = s / 16;
        ctx.moveTo(0, 6 * t);
        ctx.bezierCurveTo(0, 0, -10 * t, 0, -10 * t, 6 * t);
        ctx.bezierCurveTo(-10 * t, 12 * t, 0, 14 * t, 0, 18 * t);
        ctx.bezierCurveTo(0, 14 * t, 10 * t, 12 * t, 10 * t, 6 * t);
        ctx.bezierCurveTo(10 * t, 0, 0, 0, 0, 6 * t);
        ctx.closePath();
    }
    function drawSpark(s) {
        ctx.beginPath();
        const r = s * 0.55;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            const rr = i % 2 === 0 ? r : r * 0.45;
            ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
        }
        ctx.closePath();
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.vy += p.g;
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 1;

            const a = clamp(p.life / 78, 0, 1);
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot * (78 - p.life) * 0.02);
            ctx.globalAlpha = a;
            ctx.fillStyle = "rgba(255,255,255,.95)";
            if (p.kind === "heart") { drawHeart(p.size); ctx.fill(); }
            else { drawSpark(p.size); ctx.fill(); }
            ctx.restore();

            if (p.life <= 0 || p.y > H + 40) particles.splice(i, 1);
        }
        requestAnimationFrame(loop);
    }
    loop();

    function sparkleRain(durationMs = 900) {
        const start = performance.now();
        function tick(now) {
            if (now - start < durationMs) {
                burst(rand(40, W - 40), rand(30, 90), 0.55);
                requestAnimationFrame(tick);
            }
        }
        requestAnimationFrame(tick);
    }

    // ====== UI helpers ======
    const TOTAL = 7;
    function setStep(n) {
        meterFill.style.width = `${Math.round((n / TOTAL) * 100)}%`;
        meterText.textContent = `${n}/${TOTAL}`;
    }
    function setTag(t) { tag.textContent = t; }

    function typewriter(el, text, speed = 16) {
        el.innerHTML = `<span class="type"></span>`;
        const span = el.querySelector(".type");
        let i = 0;
        const t = setInterval(() => {
            span.textContent += text[i] || "";
            i++;
            if (i >= text.length) {
                clearInterval(t);
                span.classList.remove("type");
            }
        }, speed);
    }

    function transitionTo(renderFn) {
        card.classList.add("fadeOut");
        setTimeout(() => {
            renderFn();
            card.classList.remove("fadeOut");
            card.classList.add("fadeIn");
            setTimeout(() => card.classList.remove("fadeIn"), 330);
        }, 260);
    }

    function btnFX() {
        const btns = content.querySelectorAll("button");
        btns.forEach(b => {
            b.addEventListener("click", () => {
                const r = b.getBoundingClientRect();
                burst(r.left + r.width * 0.5, r.top + r.height * 0.4, 0.9);
            }, { once: false });
        });
    }

    // ====== Narrative State ======
    let vibe = 70;       // atrevido pero fino
    let secretCount = 0;
    const SECRET_TARGET = 6;

    function showSignature() {
        const now = new Date();
        const stamp = now.toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });
        sigMeta.textContent = `Firma: ${stamp}`;
        signature.hidden = false;
    }
    function hideSignature() {
        signature.hidden = true;
    }

    // ====== Steps ======
    function step1() {
        hideSignature();
        setStep(1);
        setTag("Modo: discreto 😌");
        footerMini.textContent = "Hecho con intención bonita. Sin presión.";

        content.innerHTML = `
      <h1 class="title">Aviso importante</h1>
      <p class="subtitle">Esto fue hecho <strong>solo</strong> para <strong>${HER_NAME}</strong>.</p>
      <p class="muted">Si no eres ${HER_NAME}… lo correcto es cerrar aquí 😅</p>

      <button class="btn primary" id="ok">
        Ok… soy ${HER_NAME} 👀
        <span class="btnGlow"></span>
      </button>

      <p class="kicker">PD: aquí no hay tickets. Solo curiosidad.</p>
    `;
        document.getElementById("ok").addEventListener("click", () => transitionTo(step2));
        btnFX();
    }

    function step2() {
        setStep(2);
        setTag("Modo: mini broma 😏");
        footerMini.textContent = "Tranquila: no vengo a asustarte.";

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Confirmación rápida</h2>
      <p class="soft" id="t2"></p>
      <p class="muted">No hay contraseñas,</p>
      <p class="muted">no hay monitores rebeldes…</p>
      <p class="soft"><strong>solo un detalle bien pensado</strong> 🙃</p>

      <button class="btn primary" id="next">
        Va… a ver 😌
        <span class="btnGlow"></span>
      </button>
      <p class="kicker">Si sonríes tantito, no pasa nada.</p>
    `;
        typewriter(document.getElementById("t2"), "Hola. Esto NO es IT… pero sí es intencional.", 15);
        document.getElementById("next").addEventListener("click", () => transitionTo(step3));
        btnFX();
    }

    function step3() {
        setStep(3);
        setTag("Modo: sincero (con clase) ✨");
        footerMini.textContent = "Aquí empieza lo bueno: sin intensidad.";

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Te digo algo directo</h2>
      <p class="soft" id="t3"></p>

      <p class="muted">No quise mandarte un “hola” común,</p>
      <p class="muted">porque tú no se sienten como alguien común.</p>

      <button class="btn primary" id="next">
        Ok… continúa 👀
        <span class="btnGlow"></span>
      </button>

      <p class="kicker">Sí: esto fue hecho a propósito.</p>
    `;

        typewriter(
            document.getElementById("t3"),
            `La primera vez que te vi pensé: “tiene una calma peligrosa… de esas que uno intenta disimular, y no puede.”`,
            14
        );

        document.getElementById("next").addEventListener("click", () => transitionTo(step4));
        btnFX();
    }

    function step4() {
        setStep(4);
        setTag("Modo: galería secreta 👀");
        footerMini.textContent = "Si esto se siente bonito… es la idea.";

        // Si no hay fotos, saltamos
        if (!PHOTO_URLS || PHOTO_URLS.length === 0) {
            transitionTo(step5);
            return;
        }

        const firstCaption = pick(PHOTO_CAPTIONS);

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Un detalle visual</h2>
      <p class="muted">No para presumirte…</p>
      <p class="soft"><strong>para decirte lo que me provoca tu vibra.</strong></p>

      <div class="gallery" id="gallery">
        ${PHOTO_URLS.map((u, i) => `<img src="${u}" alt="Foto ${i + 1}" loading="lazy" decoding="async">`).join("")}
      </div>

      <div class="caption" id="cap">
        ${firstCaption}
        <div class="kicker" style="margin-top:8px;">Tip: toca la imagen para cambiar 😉</div>
      </div>

      <button class="btn primary" id="next">
        Ok… sigue ✨
        <span class="btnGlow"></span>
      </button>
    `;

        const gallery = document.getElementById("gallery");
        const imgs = [...gallery.querySelectorAll("img")];
        const cap = document.getElementById("cap");

        let idx = 0;
        function show(i) {
            imgs.forEach(im => im.classList.remove("show"));
            imgs[i].classList.add("show");
            cap.firstChild.textContent = "";
            cap.innerHTML = `${pick(PHOTO_CAPTIONS)}<div class="kicker" style="margin-top:8px;">Tip: toca la imagen para cambiar 😉</div>`;
            burst(W * 0.5, H * 0.45, 0.55);
        }

        // mostrar primera
        show(0);

        /*gallery.addEventListener("click", () => {
            idx = (idx + 1) % imgs.length;
            show(idx);
        });*/

        let auto = setInterval(() => {
            idx = (idx + 1) % imgs.length;
            show(idx);
        }, 2200);

        // Si ella toca, que el autoplay se detenga (se siente premium)
        gallery.addEventListener("click", () => {
            clearInterval(auto);
            idx = (idx + 1) % imgs.length;
            show(idx);
        }, { once: true });

        document.getElementById("next").addEventListener("click", () => transitionTo(step5));
        btnFX();
    }

    function step5() {
        setStep(5);
        setTag("Modo: fino → atrevido 😌");
        footerMini.textContent = "Tú marcas el ritmo. Yo lo respeto.";

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Elige el tono</h2>
      <p class="soft">Para que esto sea cómodo… pero interesante.</p>

      <div style="margin-top:14px;padding:12px;border-radius:18px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);text-align:left;">
        <p class="muted" style="margin:0 0 8px;">Nivel: <strong id="lvl">${vibe}</strong>/100</p>
        <input id="range" type="range" min="0" max="100" value="${vibe}" style="width:100%;" />
        <p class="kicker" id="lbl" style="margin:8px 0 0;">Modo: atrevido… pero fino 😏</p>
      </div>

      <button class="btn primary" id="next">
        Listo… así ✨
        <span class="btnGlow"></span>
      </button>
    `;

        const range = document.getElementById("range");
        const lvl = document.getElementById("lvl");
        const lbl = document.getElementById("lbl");

        function setLabel() {
            if (vibe <= 33) lbl.textContent = "Modo: elegante y suave 🙂";
            else if (vibe <= 66) lbl.textContent = "Modo: coqueto con clase 😌";
            else lbl.textContent = "Modo: atrevido… pero fino 😏";
        }
        setLabel();

        range.addEventListener("input", () => {
            vibe = parseInt(range.value, 10);
            lvl.textContent = vibe;
            setLabel();
            burst(W * 0.5, H * 0.42, 0.35);
        });

        document.getElementById("next").addEventListener("click", () => transitionTo(step6));
        btnFX();
    }

    function step6() {
        setStep(6);
        setTag("Modo: secreto 👀");
        footerMini.textContent = "Si llegaste aquí… ya me caes bien 😅";

        secretCount = 0;

        const lineLow = "No es solo que seas linda… es que te ves tranquila. Y eso se siente raro (en el buen sentido).";
        const lineMid = "Tienes esa mezcla peligrosa: elegancia tranquila… y mirada que no pide permiso.";
        const lineHigh = "Voy a ser honesto: contigo me sale esa sonrisita que uno intenta disimular. Y sí… me gusta.";

        const msg = (vibe <= 33) ? lineLow : (vibe <= 66) ? lineMid : lineHigh;

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Ok… una última cosa</h2>
      <p class="soft">${msg}</p>
      <p class="muted">Y ya que te quedaste…</p>
      <p class="soft"><strong>toca el corazón</strong> para desbloquear el final.</p>

      <button class="heartBtn" id="heart" aria-label="Corazón">❤️</button>
      <p class="kicker" id="counter">Secreto: ${secretCount}/${SECRET_TARGET}</p>

      <button class="btn ghost" id="skip">Ok… ya, dame el final 😅</button>
    `;

        const counter = document.getElementById("counter");
        const heart = document.getElementById("heart");

        function update() {
            counter.textContent = `Secreto: ${secretCount}/${SECRET_TARGET}`;
            if (secretCount >= SECRET_TARGET) {
                sparkleRain(900);
                burst(W * 0.5, H * 0.32, 1.1);
                transitionTo(step7);
            }
        }

        heart.addEventListener("click", () => {
            secretCount++;
            const r = heart.getBoundingClientRect();
            burst(r.left + r.width * 0.5, r.top + r.height * 0.4, 1.0);
            update();
        });

        document.getElementById("skip").addEventListener("click", () => transitionTo(step7));
        btnFX();
    }

    function step7() {
        setStep(7);
        setTag("Modo: intención real ✨");
        footerMini.textContent = "Último paso. Sin presionar.";

        showSignature();

        content.innerHTML = `
      <h2 class="title" style="font-size:26px;">Y ahora sí…</h2>

      <p class="soft">
        No quiero suponer nada.<br>
        Solo quiero saber si puedo invitarte a conocernos<br>
        <strong>sin interrumpir nada bonito que ya tengas.</strong>
      </p>

      <p class="muted" style="margin-top:10px;">
        Si te late, perfecto.<br>
        Si no, también perfecto. De verdad.
      </p>

      <div class="row">
        <button class="btn primary" id="yes">
          Va… me late 😌
          <span class="btnGlow"></span>
        </button>
        <button class="btn ghost" id="no">
          Paso (pero estuvo lindo) 🙂
        </button>
      </div>

      <p class="kicker"><strong>— Hecho especialmente para ti, ${HER_NAME}.</strong></p>
    `;

        document.getElementById("yes").addEventListener("click", () => {
            burst(W * 0.5, H * 0.35, 1.2);
            sparkleRain(700);

            transitionTo(() => {
                setTag("Ok… me puse tantito nervioso 😅");
                content.innerHTML = `
          <h2 class="title" style="font-size:26px;">Trato hecho 😏</h2>
          <p class="soft">
            Prometo algo simple: una salida tranquila,<br>
            buena plática… y cero prisas.
          </p>
          <p class="muted">Tú pones el día. Yo pongo el plan.</p>

          <button class="btn primary" id="restart">
            Repetir (porque sí) ✨
            <span class="btnGlow"></span>
          </button>

          <p class="kicker">Si esto te sacó una sonrisa… misión cumplida.</p>
        `;
                document.getElementById("restart").addEventListener("click", () => transitionTo(step1));
                btnFX();
            });
        });

        document.getElementById("no").addEventListener("click", () => {
            transitionTo(() => {
                setTag("Modo: respeto total 🤍");
                content.innerHTML = `
          <h2 class="title" style="font-size:26px;">Perfecto 🙂</h2>
          <p class="soft">Gracias por leerlo. En serio.</p>
          <p class="muted">Esto se queda aquí… bonito y tranquilo.</p>

          <button class="btn primary" id="restart">
            Repetir (por curiosidad) ✨
            <span class="btnGlow"></span>
          </button>
        `;
                document.getElementById("restart").addEventListener("click", () => transitionTo(step1));
                btnFX();
            });
        });

        btnFX();
    }

    // Start
    transitionTo(step1);

    // Subtle sparkles anywhere (nice touch)
    document.addEventListener("pointerdown", (e) => {
        burst(e.clientX, e.clientY, 0.65);
    }, { passive: true });
});
