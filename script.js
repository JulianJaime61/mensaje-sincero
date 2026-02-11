document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    document.getElementById("startBtn").addEventListener("click", step1);

    function step1() {
        content.innerHTML = `
            <p class="soft">Ahora sí… siendo honesto.</p>
            <p>No soy muy bueno para empezar conversaciones así,</p>
            <p>pero tampoco quería quedarme con la duda.</p>
            <button id="next1">Continúa</button>
        `;
        document.getElementById("next1").addEventListener("click", step2);
    }

    function step2() {
        content.innerHTML = `
            <p>Desde el primer día pensé algo sencillo:</p>
            <p><strong>“Se ve una persona linda… y tranquila.”</strong></p>
            <p class="soft">De esas que se notan, sin hacer ruido.</p>
            <button id="next2">Sigue</button>
        `;
        document.getElementById("next2").addEventListener("click", step3);
    }

    function step3() {
        content.innerHTML = `
           <p>No es nada intenso 😅</p>
            <p>Solo esa sensación</p>
            <p>cuando alguien te parece linda</p>
            <p>y sonríes sin darte cuenta.</p>
            <button id="next3">Ok 😊</button>
        `;
        document.getElementById("next3").addEventListener("click", step4);
    }

    function step4() {
        content.innerHTML = `
            <p class="soft">Antes de terminar…</p>
            <p>hay algo sencillo que me dio curiosidad.</p>
            <p><strong>¿Actualmente estás saliendo con alguien?</strong></p>

            <button id="yesBtn">Sí</button>
            <button id="noBtn">No</button>
        `;

        document.getElementById("yesBtn").addEventListener("click", () => saveAnswer("si"));
        document.getElementById("noBtn").addEventListener("click", () => saveAnswer("no"));
        /*document.getElementById("preferBtn").addEventListener("click", () => saveAnswer("prefiere_no"));*/
    }

    function saveAnswer(answer) {
        localStorage.setItem("respuesta_relacion", answer);
        finalStep();
    }

    function finalStep() {
        content.innerHTML = `
            <p><strong>Gracias por leer hasta el final.</strong></p>
            <p>Prometo que esto fue con buena intención 😅</p>

            <p class="soft">
                 Y si esto se sintió bonito de leer,<br>
                creo que podría ser bonito conocernos.<br>
            <strong>¿Te animas?</strong>
            </p>

            <button class="whatsapp-btn" onclick="abrirWhatsApp()">
            Me animo 💬
</button>`;
    }
});

// ⬇️ ⬇️ ⬇️
// ESTA FUNCIÓN VA FUERA DEL DOMContentLoaded
function abrirWhatsApp() {
    const respuesta = localStorage.getItem("respuesta_relacion");
    const numero = "526564295894"; // TU NÚMERO REAL

    let mensaje = "";

    if (respuesta === "no") {
        mensaje = "Hola… 🙈 vi la animación y la verdad me pareció un detalle muy bonito 😊";
    } else {
        mensaje = "Hola 🙂 vi la animación. Gracias por la sinceridad, fue un detalle muy lindo.";
    }

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
}
