const participantesContainer = document.getElementById("participantes-container");
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

    participantes.sort((a, b) =>
        a.nombre.localeCompare(
            b.nombre,
            "es",
            { sensitivity: "base" }
        )
    );

    participantesContainer.innerHTML = "";
    rankingContainer.innerHTML = "";

    document.getElementById("participantes-count").textContent =
        participantes.length;

    let totalEquipos = 0;

    participantes.forEach(participante => {

        totalEquipos += participante.equipos.length;

        const card = document.createElement("div");
        card.className = "participante-card";

        const fotoHTML = participante.foto
            ? `<img src="assets/fotos/${participante.foto}" alt="${participante.nombre}">`
            : `<div class="sin-foto">Sin Foto</div>`;

        const equiposHTML = participante.equipos
            .map(equipo => `
                <div class="equipo vivo">
                    ${banderas[equipo] || "🏳️"} ${equipo}
                </div>
            `)
            .join("");

        card.innerHTML = `
            ${fotoHTML}

            <div class="participante-info">

                <h3>${participante.nombre}</h3>

                ${equiposHTML}

                <p>
                    <strong>Total equipos:</strong>
                    ${participante.equipos.length}
                </p>

            </div>
        `;

        participantesContainer.appendChild(card);

    });

    document.getElementById("equipos-vivos").textContent =
        totalEquipos;

    document.getElementById("equipos-eliminados").textContent =
        0;

    const ranking = [...participantes];

    ranking.forEach((persona, index) => {

        const item = document.createElement("div");

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

        rankingContainer.appendChild(item);

    });
    
}

cargarParticipantes();
