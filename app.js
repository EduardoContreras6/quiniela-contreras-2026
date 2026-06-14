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

const MONTO_PREMIO = "$1,600";

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
let equiposVivos = 0;
let equiposEliminados = 0;
let campeon = null;

participantes.forEach(participante => {

    let vivosPersona = 0;
    let tieneCampeon = false;

    participante.equipos.forEach(equipo => {

        totalEquipos++;

        const estado = estados[equipo] || "vivo";

        if (estado === "vivo") {
            equiposVivos++;
            vivosPersona++;
        }

        if (estado === "eliminado") {
            equiposEliminados++;
        }

        if (estado === "campeon") {
            campeon = equipo;
            tieneCampeon = true;
        }

    });

    participante.equiposVivos = vivosPersona;
    participante.tieneCampeon = tieneCampeon;

});

document.getElementById("monto-premio").textContent =
    MONTO_PREMIO;;

document.getElementById("equipos-eliminados").textContent =
    equiposVivos;

const ranking = [...participantes].sort((a, b) => {

    if (a.tieneCampeon && !b.tieneCampeon) return -1;
    if (!a.tieneCampeon && b.tieneCampeon) return 1;

    if (b.equiposVivos !== a.equiposVivos) {
        return b.equiposVivos - a.equiposVivos;
    }

    return a.nombre.localeCompare(
        b.nombre,
        "es",
        { sensitivity: "base" }
    );

});

    ranking.forEach((persona, index) => {

        const item = document.createElement("div");

        item.style.cursor = "pointer";

        item.className = "ranking-item";

const fotoRanking = persona.foto
    ? `<img src="assets/fotos/${persona.foto}" class="ranking-avatar">`
    : `<div class="ranking-avatar ranking-sin-foto">?</div>`;

const banderasRanking = persona.equipos
    .map(equipo => {
        const estado = estados[equipo] || "vivo";

        return `
            <span class="ranking-bandera ${estado}" title="${equipo}">
                ${banderas[equipo] || "🏳️"}
            </span>
        `;
    })
    .join("");

item.innerHTML = `
    <div class="ranking-info">

        ${fotoRanking}

        <div class="ranking-texto">

            <strong>#${index + 1}</strong>

            <div>${persona.nombre}</div>

            <div class="ranking-banderas">
                ${banderasRanking}
            </div>

            <small>
                ${persona.tieneCampeon ? "🏆 Campeón de la quiniela" : `🟢 ${persona.equiposVivos} vivos / ⚽ ${persona.equipos.length} equipos`}
            </small>

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

    actualizarPodio(ranking, campeon);
    
}

function actualizarPodio(ranking, campeon) {

    const primero = ranking[0];
    const segundo = ranking[1];
    const tercero = ranking[2];

    function crearPodioCard(persona, posicion, etiqueta) {

        if (!persona) {
            return `
                <div class="podio-card">
                    <div class="medalla">${posicion}</div>
                    <p>Pendiente</p>
                </div>
            `;
        }

        const foto = persona.foto
            ? `<img src="assets/fotos/${persona.foto}" class="podio-avatar">`
            : `<div class="podio-avatar podio-sin-foto">?</div>`;

        const textoEstado = persona.tieneCampeon
            ? `🏆 Tiene a ${campeon}`
            : `🟢 ${persona.equiposVivos} equipos vivos`;

        return `
            <div class="podio-card">
                <div class="medalla">${posicion}</div>

                ${foto}

                <h3>${persona.nombre}</h3>

                <p>${textoEstado}</p>

                <small>${etiqueta}</small>
            </div>
        `;
    }

    document.getElementById("primero").innerHTML =
        crearPodioCard(primero, "🥇", campeon ? "Ganador actual" : "Primer lugar provisional");

    document.getElementById("segundo").innerHTML =
        crearPodioCard(segundo, "🥈", "Segundo lugar");

    document.getElementById("tercero").innerHTML =
        crearPodioCard(tercero, "🥉", "Tercer lugar");
}

cargarParticipantes();

document
    .getElementById("cerrar-modal")
    .addEventListener("click", () => {

        document.getElementById("modal").style.display =
            "none";

});
