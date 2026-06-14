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
    "Republica Democratica del Congo": "🇨🇩",
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
const bracketContainer = document.getElementById("bracket-container");

const MONTO_PREMIO = "$1,600";

const OPENFOOTBALL_URL =
    "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

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
    const estadosManual = await estadosResponse.json();

    const partidos = await cargarPartidosAutomaticos();

    const estados = calcularEstadosAutomaticos(
        partidos,
        estadosManual
    );

    renderizarBracket(partidos, participantes);

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

            const proximosPartidosHTML = crearHTMLProximosPartidos(
                persona,
                partidos
            );

            document.getElementById("modal-body").innerHTML = `
                <div style="text-align:center">

                    ${foto}

                    <h2>${persona.nombre}</h2>

                    ${equipos}

                    <p style="margin-top:20px">
                        ⚽ ${persona.equipos.length} equipos
                    </p>

                    ${proximosPartidosHTML}

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

function formatearFechaPartido(fechaISO) {

    const fecha = new Date(fechaISO);

    return fecha.toLocaleString("es-MX", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Mexico_City"
    });
}

function obtenerProximosPartidos(equiposPersona, partidos) {

    const ahora = new Date();

    return partidos
        .filter(partido =>
            equiposPersona.includes(partido.local) ||
            equiposPersona.includes(partido.visitante)
        )
        .filter(partido => {

            const fechaPartido = new Date(partido.fecha);
            const estado = partido.estado || "programado";

            return estado === "en-vivo" || fechaPartido >= ahora;

        })
        .sort((a, b) =>
            new Date(a.fecha) - new Date(b.fecha)
        )
        .slice(0, 3);
}

function crearHTMLProximosPartidos(persona, partidos) {

    const proximos = obtenerProximosPartidos(
        persona.equipos,
        partidos
    );

    if (proximos.length === 0) {
        return `
            <div class="proximos-partidos">
                <h3>Próximos partidos</h3>
                <p class="sin-partidos">
                    No hay próximos partidos registrados para estos equipos.
                </p>
            </div>
        `;
    }

    const partidosHTML = proximos
        .map(partido => {

            const fecha = formatearFechaPartido(partido.fecha);
            const estado = partido.estado || "programado";

            const marcador =
                estado === "finalizado" || estado === "en-vivo"
                    ? `${partido.golesLocal} - ${partido.golesVisitante}`
                    : "vs";

            const textoEstado = estado
                .replace("-", " ")
                .toUpperCase();

            return `
                <div class="proximo-partido">

                    <div class="partido-equipos">
                        ${banderas[partido.local] || "🏳️"} ${partido.local}
                        <span>${marcador}</span>
                        ${banderas[partido.visitante] || "🏳️"} ${partido.visitante}
                    </div>

                    <div class="partido-detalle">
                        📅 ${fecha}
                    </div>

                    <div class="partido-fase">
                        ${partido.fase}
                    </div>

                    <div class="estado-partido ${estado}">
                        ${textoEstado}
                    </div>

                </div>
            `;
        })
        .join("");

    return `
        <div class="proximos-partidos">
            <h3>Próximos partidos</h3>
            ${partidosHTML}
        </div>
    `;
}

function renderizarBracket(partidos, participantes) {

    if (!bracketContainer) return;

    function obtenerDuenoEquipo(equipo) {
    return participantes.find(persona =>
        persona.equipos.includes(equipo)
    );
}

function crearEquipoBracket(equipo) {

    const dueno = obtenerDuenoEquipo(equipo);

    const fotoDueno = dueno && dueno.foto
        ? `<img src="assets/fotos/${dueno.foto}" class="bracket-dueno-foto" title="${dueno.nombre}">`
        : dueno
            ? `<div class="bracket-dueno-foto bracket-dueno-sin-foto" title="${dueno.nombre}">?</div>`
            : "";

    return `
        <div class="bracket-equipo-linea">
            <span>${banderas[equipo] || "🏳️"} ${equipo}</span>
            ${fotoDueno}
        </div>
    `;
}

    const ordenFases = [
        "Grupo A",
        "Grupo B",
        "Grupo C",
        "Grupo D",
        "Grupo E",
        "Grupo F",
        "Grupo G",
        "Grupo H",
        "Grupo I",
        "Grupo J",
        "Grupo K",
        "Grupo L",
        "Dieciseisavos",
        "Octavos",
        "Cuartos",
        "Semifinales",
        "Tercer lugar",
        "Final"
    ];

    const partidosOrdenados = [...partidos].sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
    );

    const partidosPorFase = {};

    partidosOrdenados.forEach(partido => {

        if (!partidosPorFase[partido.fase]) {
            partidosPorFase[partido.fase] = [];
        }

        partidosPorFase[partido.fase].push(partido);

    });

    const fasesHTML = ordenFases
        .filter(fase => partidosPorFase[fase])
        .map(fase => {

            const partidosHTML = partidosPorFase[fase]
                .map(partido => {

                    const fecha = formatearFechaPartido(partido.fecha);
                    const estado = partido.estado || "programado";

                    const marcador =
                        estado === "finalizado" || estado === "en-vivo"
                            ? `${partido.golesLocal} - ${partido.golesVisitante}`
                            : "vs";

                    const textoEstado = estado
                        .replace("-", " ")
                        .toUpperCase();

                    return `
                        <div class="bracket-partido">

                        <div class="bracket-equipos">

                            ${crearEquipoBracket(partido.local)}

                            <strong>${marcador}</strong>

                            ${crearEquipoBracket(partido.visitante)}

                        </div>

                            <div class="estado-partido ${estado}">
                                ${textoEstado}
                            </div>

                            <div class="bracket-fecha">
                                📅 ${fecha}
                            </div>

                        </div>
                    `;

                })
                .join("");

            return `
                <div class="fase">

                    <h3>${fase}</h3>

                    ${partidosHTML}

                </div>
            `;

        })
        .join("");

    bracketContainer.innerHTML = fasesHTML || `
        <p>No hay partidos cargados todavía.</p>
    `;
}

function normalizarNombreEquipo(nombre) {

    const nombres = {
        "Mexico": "Mexico",
        "South Africa": "Sudafrica",
        "South Korea": "Corea del Sur",
        "Czech Republic": "Republica Checa",
        "Canada": "Canada",
        "Bosnia & Herzegovina": "Bosnia y Herzegovina",
        "Qatar": "Qatar",
        "Switzerland": "Suiza",
        "Brazil": "Brasil",
        "Morocco": "Marruecos",
        "Haiti": "Haiti",
        "Scotland": "Escocia",
        "USA": "Estados Unidos",
        "Paraguay": "Paraguay",
        "Australia": "Australia",
        "Turkey": "Turquia",
        "Germany": "Alemania",
        "Curaçao": "Curazao",
        "Ivory Coast": "Costa de Marfil",
        "Ecuador": "Ecuador",
        "Netherlands": "Paises Bajos",
        "Japan": "Japon",
        "Sweden": "Suecia",
        "Tunisia": "Tunez",
        "Spain": "España",
        "Cape Verde": "Cabo Verde",
        "Saudi Arabia": "Arabia Saudita",
        "Uruguay": "Uruguay",
        "Belgium": "Belgica",
        "Egypt": "Egipto",
        "Iran": "Iran",
        "New Zealand": "Nueva Zelanda",
        "France": "Francia",
        "Senegal": "Senegal",
        "Iraq": "Irak",
        "Norway": "Noruega",
        "Argentina": "Argentina",
        "Algeria": "Argelia",
        "Austria": "Austria",
        "Jordan": "Jordania",
        "Portugal": "Portugal",
        "DR Congo": "Republica Democratica del Congo",
        "Uzbekistan": "Uzbekistan",
        "Colombia": "Colombia",
        "England": "Inglaterra",
        "Croatia": "Croacia",
        "Ghana": "Ghana",
        "Panama": "Panama"
    };

    return nombres[nombre] || nombre;
}

function convertirFase(partido) {

    if (partido.group) {
        return partido.group.replace("Group", "Grupo");
    }

    const fases = {
        "Round of 32": "Dieciseisavos",
        "Round of 16": "Octavos",
        "Quarter-final": "Cuartos",
        "Semi-final": "Semifinales",
        "Match for third place": "Tercer lugar",
        "Final": "Final"
    };

    return fases[partido.round] || partido.round || "Sin fase";
}

function convertirFechaOpenFootball(date, time) {

    if (!date || !time) {
        return date;
    }

    const match = time.match(/(\d{1,2}):(\d{2})\s+UTC([+-]\d{1,2})/);

    if (!match) {
        return `${date}T00:00:00-06:00`;
    }

    const hora = match[1].padStart(2, "0");
    const minuto = match[2];
    const offsetTexto = match[3];

    const signo = offsetTexto.startsWith("-") ? "-" : "+";
    const horasOffset = Math.abs(
        parseInt(offsetTexto, 10)
    ).toString().padStart(2, "0");

    return `${date}T${hora}:${minuto}:00${signo}${horasOffset}:00`;
}

function transformarPartidoOpenFootball(partido) {

    const local = normalizarNombreEquipo(partido.team1);
    const visitante = normalizarNombreEquipo(partido.team2);

    const tieneMarcador =
        partido.score &&
        partido.score.ft &&
        Array.isArray(partido.score.ft);

    return {
        local: local,
        visitante: visitante,
        fecha: convertirFechaOpenFootball(partido.date, partido.time),
        fase: convertirFase(partido),
        estado: tieneMarcador ? "finalizado" : "programado",
        golesLocal: tieneMarcador ? partido.score.ft[0] : null,
        golesVisitante: tieneMarcador ? partido.score.ft[1] : null
    };
}

async function cargarPartidosAutomaticos() {

    try {

        const response = await fetch(
            `${OPENFOOTBALL_URL}?t=${Date.now()}`
        );

        if (!response.ok) {
            throw new Error("No se pudo cargar OpenFootball");
        }

        const data = await response.json();

        return data.matches.map(transformarPartidoOpenFootball);

    } catch (error) {

        console.warn(
            "No se pudo cargar OpenFootball. Usando partidos.json local.",
            error
        );

        const partidosResponse = await fetch("assets/data/partidos.json");
        return await partidosResponse.json();
    }
}

function calcularEstadosAutomaticos(partidos, estadosManual) {

    const estados = { ...estadosManual };

    const fasesEliminacion = [
        "Dieciseisavos",
        "Octavos",
        "Cuartos",
        "Semifinales",
        "Tercer lugar",
        "Final"
    ];

    partidos.forEach(partido => {

        const estadoPartido = partido.estado || "programado";

        if (
            estadoPartido !== "finalizado" ||
            !fasesEliminacion.includes(partido.fase)
        ) {
            return;
        }

        const golesLocal = Number(partido.golesLocal);
        const golesVisitante = Number(partido.golesVisitante);

        let ganador = null;
        let perdedor = null;

        if (golesLocal > golesVisitante) {
            ganador = partido.local;
            perdedor = partido.visitante;
        }

        if (golesVisitante > golesLocal) {
            ganador = partido.visitante;
            perdedor = partido.local;
        }

        if (!ganador || !perdedor) {
            return;
        }

        estados[perdedor] = "eliminado";

        if (partido.fase === "Final") {
            estados[ganador] = "campeon";
        }

    });

    return estados;
}

cargarParticipantes().catch(error => {
    console.error("Error general cargando la página:", error);

    if (rankingContainer) {
        rankingContainer.innerHTML = `
            <div class="ranking-item">
                <strong>Error cargando la información</strong>
                <p>Revisa la consola del navegador o los archivos JSON.</p>
            </div>
        `;
    }

    if (bracketContainer) {
        bracketContainer.innerHTML = `
            <p>No se pudo cargar el bracket.</p>
        `;
    }
});

document
    .getElementById("cerrar-modal")
    .addEventListener("click", () => {

        document.getElementById("modal").style.display =
            "none";

});

document
    .getElementById("modal")
    .addEventListener("click", (event) => {

        if (event.target.id === "modal") {
            document.getElementById("modal").style.display = "none";
        }

    });

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        document.getElementById("modal").style.display = "none";
    }

});
