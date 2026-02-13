document.addEventListener("DOMContentLoaded", () => {
  const content = document.getElementById("content");
  const tag = document.getElementById("tag");
  const startBtn = document.getElementById("startBtn");
  const meterFill = document.getElementById("meterFill");
  const meterText = document.getElementById("meterText");
  const footerMini = document.getElementById("footerMini");

  // ===== FX canvas (sparkles al tocar) =====
  const fx = document.getElementById("fx");
  const ctx = fx.getContext("2d", { alpha: true });
  let W = 0, H = 0, dpr = 1;
  let sparks = [];

  function resize(){
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = window.innerWidth; H = window.innerHeight;
    fx.width = Math.floor(W * dpr);
    fx.height = Math.floor(H * dpr);
    fx.style.width = W + "px";
    fx.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize, { passive:true });
  resize();

  function spawnSpark(x, y, power=1){
    const n = Math.floor(18 * power);
    for(let i=0;i<n;i++){
      sparks.push({
        x, y,
        vx: (Math.random()-0.5) * 4.2 * power,
        vy: (Math.random()-0.9) * 5.0 * power,
        g: 0.10,
        life: 46 + Math.random()*24,
        size: 2 + Math.random()*2.5,
        a: 0.9
      });
    }
  }

  function loop(){
    ctx.clearRect(0,0,W,H);
    for(let i=sparks.length-1;i>=0;i--){
      const p = sparks[i];
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      p.a *= 0.985;

      ctx.globalAlpha = Math.max(0, p.a);
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();

      if(p.life<=0 || p.y>H+30 || p.a<0.05) sparks.splice(i,1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();

  function tapFX(x, y){
    try { navigator.vibrate?.(18); } catch(_){}
    spawnSpark(x, y, 1);
  }

  // ===== UI helpers =====
  const TOTAL = 5;
  function setStep(n){
    const pct = Math.round((n / TOTAL) * 100);
    meterFill.style.width = `${pct}%`;
    meterText.textContent = `${n}/${TOTAL}`;
  }
  function typewriter(el, text, speed = 16){
    el.innerHTML = `<span class="type"></span>`;
    const span = el.querySelector(".type");
    let i=0;
    const t = setInterval(() => {
      span.textContent += text[i] || "";
      i++;
      if(i>=text.length){
        clearInterval(t);
        span.classList.remove("type");
      }
    }, speed);
  }
  function setTag(text){ tag.textContent = text; }

  function attachButtonFX(){
    content.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        const r = btn.getBoundingClientRect();
        tapFX(r.left + r.width/2, r.top + r.height/2);
      }, { passive:true });
    });
  }

  // Tilt suave
  const card = document.getElementById("card");
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(0) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `translateY(0) rotateX(0deg) rotateY(0deg)`;
  });

  // ===== Mini-game: atrapa 3 corazones =====
  function startHeartMiniGame(onDone){
    setTag("Mini reto 😌");
    content.innerHTML = `
      <h2 class="title" style="font-size:26px;margin-top:6px;">Antes de la última parte…</h2>
      <p class="soft">Pequeño reto (5 segundos):</p>
      <p><strong>Atrapa 3 corazoncitos</strong> tocándolos 💗</p>
      <p class="miniHint" id="counter">0/3 atrapados</p>
      <button class="btn ghost" id="skipBtn" style="margin-top:12px;">Ok ya… me rindo 😅</button>
    `;

    const counter = document.getElementById("counter");
    const skipBtn = document.getElementById("skipBtn");
    attachButtonFX();

    // corazones flotantes en el DOM
    const hearts = [];
    let caught = 0;
    let raf = null;
    let running = true;

    function makeHeart(){
      const el = document.createElement("div");
      el.textContent = "💗";
      el.style.position = "fixed";
      el.style.left = (Math.random() * (W - 60) + 20) + "px";
      el.style.top = (Math.random() * (H - 220) + 120) + "px";
      el.style.fontSize = (Math.random() * 10 + 28) + "px";
      el.style.filter = "drop-shadow(0 12px 22px rgba(0,0,0,.35))";
      el.style.userSelect = "none";
      el.style.cursor = "pointer";
      el.style.zIndex = "5";

      // movimiento
      const vx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.9 + 0.6);
      const vy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 0.9 + 0.6);

      const hObj = { el, vx, vy };
      document.body.appendChild(el);

      el.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        if (!running) return;
        caught++;
        counter.textContent = `${caught}/3 atrapados`;

        const r = el.getBoundingClientRect();
        tapFX(r.left + r.width/2, r.top + r.height/2);

        el.style.transition = "transform 220ms ease, opacity 220ms ease";
        el.style.transform = "scale(1.6)";
        el.style.opacity = "0";
        setTimeout(() => { el.remove(); }, 220);

        if (caught >= 3){
          finish(true);
        } else {
          // repone otro corazón para mantener 3 en juego
          setTimeout(() => {
            if (running) hearts.push(makeHeart());
          }, 120);
        }
      }, { passive:false });

      // devolver para que lo podamos manipular
      hearts.push(hObj);
      return hObj;
    }

    // crear 3 corazones iniciales
    for (let i=0;i<3;i++) makeHeart();

    function move(){
      if (!running) return;
      for (const hObj of hearts){
        if (!hObj?.el || !document.body.contains(hObj.el)) continue;

        const rect = hObj.el.getBoundingClientRect();
        let x = rect.left + hObj.vx;
        let y = rect.top + hObj.vy;

        if (x <= 10 || x >= W - 40) hObj.vx *= -1;
        if (y <= 80 || y >= H - 80) hObj.vy *= -1;

        hObj.el.style.left = (x) + "px";
        hObj.el.style.top  = (y) + "px";
      }
      raf = requestAnimationFrame(move);
    }
    raf = requestAnimationFrame(move);

    const timer = setTimeout(() => finish(false), 6000);

    function cleanup(){
      running = false;
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);

      // eliminar cualquier corazón que quede
      document.querySelectorAll("div").forEach(() => {});
      hearts.forEach(hObj => {
        if (hObj?.el && document.body.contains(hObj.el)) hObj.el.remove();
      });
    }

    function finish(success){
      cleanup();

      setTag("Listo ✨");
      content.innerHTML = `
        <h2 class="title" style="font-size:26px;margin-top:6px;">${success ? "Ok… lo lograste 😌" : "Ok… te la perdono 😅"}</h2>
        <p class="soft">${success ? "Desbloqueaste la última parte." : "Igual te dejo la última parte."}</p>
        <button class="btn primary" id="goBtn">Continuar ✨<span class="btnGlow"></span></button>
      `;
      document.getElementById("goBtn").addEventListener("click", onDone);
      attachButtonFX();
    }

    skipBtn.addEventListener("click", () => finish(false));
  }

  // ===== Steps base =====
  startBtn.addEventListener("click", step1);

  function step1(){
    setStep(2);
    setTag("Ok… ahora sí 😌");
    footerMini.textContent = "Hecho por mí, para ti. (sí, neta) 🤍";

    content.innerHTML = `
      <h2 class="title" style="font-size:26px;margin-top:6px;">Ahora sí… siendo honesto.</h2>
      <p class="soft" id="t1"></p>
      <p class="muted">No soy muy bueno para empezar conversaciones así,</p>
      <p class="muted">pero esta vez quise hacerlo diferente.</p>
      <p class="soft">Y sí… esto lo hice <strong>especialmente para ti</strong>, Gaby 😊</p>
      <button class="btn primary" id="next1">Continúa ✨<span class="btnGlow"></span></button>
    `;
    typewriter(document.getElementById("t1"), "Prometo que esto no es un ticket 😅", 18);
    document.getElementById("next1").addEventListener("click", step2);
    attachButtonFX();
  }

  function step2(){
    setStep(3);
    setTag("Un detalle sincero 🤍");

    content.innerHTML = `
      <h2 class="title" style="font-size:26px;margin-top:6px;">La primera vez que te vi pensé:</h2>
      <p><strong>“Ok… ella tiene algo.”</strong></p>
      <p class="soft">De esas personas que llaman la atención sin darse cuenta.</p>
      <p class="muted" id="t2"></p>
      <button class="btn primary" id="next2">Sigue 😌<span class="btnGlow"></span></button>
    `;
    typewriter(document.getElementById("t2"), "Y lo dije en mi cabeza como si fuera un secreto.", 16);
    document.getElementById("next2").addEventListener("click", step3);
    attachButtonFX();
  }

  function step3(){
    setStep(4);
    setTag("Cero intensidad, lo juro 😅");

    content.innerHTML = `
      <h2 class="title" style="font-size:26px;margin-top:6px;">No es nada intenso 😅</h2>
      <p class="muted">Solo esa sensación…</p>
      <p class="muted">cuando alguien te parece linda</p>
      <p class="muted">y sonríes sin darte cuenta.</p>
      <button class="btn primary" id="next3">Ok 😊<span class="btnGlow"></span></button>
    `;
    document.getElementById("next3").addEventListener("click", () => {
      // Antes de la pregunta, mini juego
      startHeartMiniGame(step4);
    });
    attachButtonFX();
  }

  function step4(){
    setStep(5);
    setTag("Pregunta simple 🙂");

    content.innerHTML = `
      <h2 class="title" style="font-size:26px;margin-top:6px;">Antes de terminar…</h2>
      <p class="soft">hay algo sencillo que me dio curiosidad.</p>
      <p><strong>¿Actualmente estás saliendo con alguien?</strong></p>

      <div class="row">
        <button class="btn ghost" id="yesBtn">Sí</button>
        <button class="btn ghost" id="noBtn">No</button>
      </div>

      <div id="after" style="display:none;">
        <p class="miniHint" id="finalHint" style="margin-top:14px;"></p>
        <button class="btn whatsapp" id="waBtn">Me animo 💬</button>
      </div>
    `;

    const after = document.getElementById("after");
    const hint = document.getElementById("finalHint");
    const waBtn = document.getElementById("waBtn");

    document.getElementById("yesBtn").addEventListener("click", () => done("si"));
    document.getElementById("noBtn").addEventListener("click", () => done("no"));

    function done(answer){
      localStorage.setItem("respuesta_relacion", answer);

      after.style.display = "block";
      if(answer === "no"){
        hint.innerHTML = `<strong>Gracias por llegar hasta aquí.</strong><br>Si esto te sacó una sonrisita… podría ser bonito conocernos 😊`;
      }else{
        hint.innerHTML = `<strong>Gracias por leer hasta el final.</strong><br>Fue un detalle con buena intención 🤍`;
      }

      waBtn.onclick = abrirWhatsApp;
      attachButtonFX();
    }

    attachButtonFX();
  }
});

// Fuera del DOMContentLoaded
function abrirWhatsApp() {
  const respuesta = localStorage.getItem("respuesta_relacion");
  const numero = "526564295894"; // tu número

  let mensaje = "";
  if (respuesta === "no") {
    mensaje = "Hola Gaby… 🙈 vi la animación y la verdad me pareció un detalle muy bonito 😊";
  } else {
    mensaje = "Hola Gaby 🙂 vi la animación. Gracias por la sinceridad, fue un detalle lindo.";
  }

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
}
