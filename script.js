document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");
    const startBtn = document.getElementById("startBtn");

    startBtn.addEventListener("click", step1);

    function step1() {
        content.innerHTML = `
            <div class="heart">❤️</div>
            <p>Ok… ahora sí, siendo sincero.</p>
            <button id="next1">Continúa</button>
        `;
        document.getElementById("next1").addEventListener("click", step2);
    }

    function step2() {
        content.innerHTML = `
            <p>Desde el primer momento pensé algo…</p>
            <p>Y preferí decirlo bonito.</p>
            <button id="next2">Sigue leyendo</button>
        `;
        document.getElementById("next2").addEventListener("click", step3);
    }

    function step3() {
        content.innerHTML = `
        <p><strong>No era mi intención decirte esto…</strong></p>
        <p>pero tienes una sonrisa que provoca otras, incluso a la distancia.</p>

        <p style="margin-top:20px;">— Alguien que decidió ser valiente</p>

        <button id="endBtn" style="margin-top:25px;">Cerrar ✖️</button>
    `;

        document.getElementById("endBtn").addEventListener("click", surprise);
    }

    function surprise() {
        content.innerHTML = `
        <div class="heart">🎉</div>

        <p><strong>Espera…</strong></p>
        <p>No podía cerrar esto sin decir algo más.</p>

        <p style="margin-top:15px;"><strong>Feliz cumpleaños 🎂</strong></p>
        <p>
            Sé que llego un poquito tarde…  
            pero no quería dejar pasar la oportunidad de desearte  
            un año lleno de sonrisas bonitas.
        </p>

        <p style="margin-top:15px;">
            Y si alguna sonrisa empieza hoy…  
            prometo no sentirme culpable 😉
        </p>
    `;
    }


});
