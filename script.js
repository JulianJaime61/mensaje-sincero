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
            <p>No es una declaración,</p>
            <p>ni una invitación rara 😅</p>
            <p>Solo quería decirte que me dio gusto conocerte,</p>
            <p>y que me pareces alguien muy agradable.</p>
            <button id="next3">Ok 😊</button>
        `;
        document.getElementById("next3").addEventListener("click", step4);
    }

    function step4() {
        content.innerHTML = `
            <p class="soft">Antes de terminar…</p>
            <p>hay algo sencillo que me dio curiosidad.</p>
            <p><strong>¿Actualmente tienes novio?</strong></p>

            <button id="yesBtn">Sí</button>
            <button id="noBtn">No</button>
            <button id="preferBtn">Prefiero no decir 😊</button>
        `;

        document.getElementById("yesBtn").addEventListener("click", () => saveAnswer("si"));
        document.getElementById("noBtn").addEventListener("click", () => saveAnswer("no"));
        document.getElementById("preferBtn").addEventListener("click", () => saveAnswer("prefiere_no"));
    }

    function saveAnswer(answer) {
        localStorage.setItem("respuesta_relacion", answer);
        finalStep();
    }

    function finalStep() {
        content.innerHTML = `
            <p><strong>Gracias por llegar hasta aquí.</strong></p>
            <p>La verdad… me gustó hacer esto.</p>
            <p class="soft">
                Si a ti también te sacó una sonrisa,<br>
                Siento que podríamos llevarnos bien… quizá valga la pena conocernos un poco más, ¿no crees?
            </p>
            <button class="whatsapp-btn" onclick="abrirWhatsApp()">
                Continuar 💬
            </button>
        `;
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
