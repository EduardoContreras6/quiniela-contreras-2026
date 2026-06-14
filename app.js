const banderas = {
    "Argentina": "🇦🇷",
    "Arabia Saudita": "🇸🇦",
    "Argelia": "🇩🇿",
    "Australia": "🇦🇺",
    "Austria": "🇦🇹",
    "Belgica": "🇧🇪",
    "Bosnia y Herzegovina": "🇧🇦",
    "Brasil": "🇧🇷",
    "Cabo Verde": "🇨🇻",
    "Canada": "🇨🇦",
    "Colombia": "🇨🇴",
    "Congo": "🇨🇩",
    "Corea del Sur": "🇰🇷",
    "Costa de Marfil": "🇨🇮",
    "Croacia": "🇭🇷",
    "Curazao": "🇨🇼",
    "Ecuador": "🇪🇨",
    "Egipto": "🇪🇬",
    "España": "🇪🇸",
    "Estados Unidos": "🇺🇸",
    "Francia": "🇫🇷",
    "Ghana": "🇬🇭",
    "Haiti": "🇭🇹",
    "Inglaterra": "🏴",
    "Irak": "🇮🇶",
    "Iran": "🇮🇷",
    "Japon": "🇯🇵",
    "Jordania": "🇯🇴",
    "Marruecos": "🇲🇦",
    "Mexico": "🇲🇽",
    "Noruega": "🇳🇴",
    "Nueva Zelanda": "🇳🇿",
    "Paises Bajos": "🇳🇱",
    "Panama": "🇵🇦",
    "Paraguay": "🇵🇾",
    "Portugal": "🇵🇹",
    "Qatar": "🇶🇦",
    "Republica Checa": "🇨🇿",
    "Senegal": "🇸🇳",
    "Sudafrica": "🇿🇦",
    "Suecia": "🇸🇪",
    "Suiza": "🇨🇭",
    "Tunez": "🇹🇳",
    "Turquia": "🇹🇷",
    "Uruguay": "🇺🇾",
    "Uzbekistan": "🇺🇿",
    "Alemania": "🇩🇪"
};
const rankingContainer = document.getElementById("ranking-container");

function actualizarContador() {

    const fechaFinal = new Date("2026-07-19T18:00:00");

    const ahora = new Date();

    const diferencia = fechaFinal - ahora;

    const dias = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    document.getElementById(
        "contador-final"
    ).textContent = dias;
}

actualizarContador();

async function cargarParticipantes() {

    const response = await fetch("assets/data/participantes.json");
    const participantes = await response.json();
    const estadosResponse = await fetch("assets/data/estados.json");
    const estados = await estadosResponse.json();

    participantes.sort((a, b) =>
        a.nombre.localeCompare(
            b.nombre,
            "es",
            { sensitivity: "base" }
        )
    );

    rankingContainer.innerHTML = "";

    document.getElementById("participantes-count").textContent =
        participantes.length;

    let totalEquipos = 0;

    participantes.forEach(participante => {
        totalEquipos += participante.equipos.length;
    });

    document.getElementById("equipos-vivos").textContent =
        totalEquipos;

    document.getElementById("equipos-eliminados").textContent =
        0;

    const ranking = [...participantes];

    ranking.forEach((persona, index) => {

        const item = document.createElement("div");

        item.style.cursor = "pointer";

        item.className = "ranking-item";

        const fotoRanking = persona.foto
            ? `<img src="assets/fotos/${persona.foto}" class="ranking-avatar">`
            : `<div class="ranking-avatar ranking-sin-foto">?</div>`;

        item.innerHTML = `
            <div class="ranking-info">

                ${fotoRanking}

                <div>

                    <strong>#${index + 1}</strong>

                    <div>${persona.nombre}</div>

                    <small>⚽ ${persona.equipos.length} equipos</small>

                </div>

            </div>
        `;

        item.addEventListener("click", () => {

            const foto = persona.foto
                ? `<img src="assets/fotos/${persona.foto}"
                       style="width:120px;height:120px;border-radius:50%;object-fit:cover;">`
                : "";

                const equipos = persona.equipos
                    .map(e => {

                        const estado = estados[e] || "vivo";

                        return `
                            <div class="equipo ${estado}">
                                ${banderas[e] || "🏳️"} ${e}
                            </div>
                        `;

                    })
                    .join("");

            document.getElementById("modal-body").innerHTML = `
                <div style="text-align:center">

                    ${foto}

                    <h2>${persona.nombre}</h2>

                    ${equipos}

                    <p style="margin-top:20px">
                        ⚽ ${persona.equipos.length} equipos
                    </p>

                </div>
            `;

    document.getElementById("modal").style.display = "block";

});

        rankingContainer.appendChild(item);

    });
    
}

cargarParticipantes();

document
    .getElementById("cerrar-modal")
    .addEventListener("click", () => {

        document.getElementById("modal").style.display =
            "none";

});
