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
    "Escocia": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
    "España": "🇪🇸",
    "Estados Unidos": "🇺🇸",
    "Francia": "🇫🇷",
    "Ghana": "🇬🇭",
    "Haiti": "🇭🇹",
    "Inglaterra": "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
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
const nombresPaises = {
    "Mexico": "México",
    "Sudafrica": "Sudáfrica",
    "Republica Checa": "República Checa",
    "Corea del Sur": "Corea del Sur",

    "Canada": "Canadá",
    "Bosnia y Herzegovina": "Bosnia y Herzegovina",
    "Qatar": "Qatar",
    "Suiza": "Suiza",

    "Brasil": "Brasil",
    "Marruecos": "Marruecos",
    "Haiti": "Haití",
    "Escocia": "Escocia",

    "Estados Unidos": "Estados Unidos",
    "Paraguay": "Paraguay",
    "Australia": "Australia",
    "Turquia": "Turquía",

    "Alemania": "Alemania",
    "Curazao": "Curazao",
    "Costa de Marfil": "Costa de Marfil",
    "Ecuador": "Ecuador",

    "Paises Bajos": "Países Bajos",
    "Japon": "Japón",
    "Suecia": "Suecia",
    "Tunez": "Túnez",

    "Belgica": "Bélgica",
    "Egipto": "Egipto",
    "Iran": "Irán",
    "Nueva Zelanda": "Nueva Zelanda",

    "España": "España",
    "Cabo Verde": "Cabo Verde",
    "Arabia Saudita": "Arabia Saudita",
    "Uruguay": "Uruguay",

    "Francia": "Francia",
    "Senegal": "Senegal",
    "Irak": "Irak",
    "Noruega": "Noruega",

    "Argentina": "Argentina",
    "Argelia": "Argelia",
    "Austria": "Austria",
    "Jordania": "Jordania",

    "Portugal": "Portugal",
    "Republica Democratica del Congo": "República Democrática del Congo",
    "Uzbekistan": "Uzbekistán",
    "Colombia": "Colombia",

    "Inglaterra": "Inglaterra",
    "Croacia": "Croacia",
    "Ghana": "Ghana",
    "Panama": "Panamá"
};

function nombrePais(equipo) {
    return nombresPaises[equipo] || equipo;
}
const logosCanales = {
    vix: "assets/canales/vix.png",
    azteca: "assets/canales/azteca.png",
    canal5: "assets/canales/canal5.png",
    lasestrellas: "assets/canales/lasestrellas.png"
};
const rankingContainer = document.getElementById("ranking-container");
const bracketContainer = document.getElementById("bracket-container");
const gruposContainer = document.getElementById("grupos-container");

const MONTO_PREMIO = "$1,600";
let fuentePartidos = "Sin cargar";
let ultimaCargaPartidos = null;
let partidosCargados = [];

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

async function cargarTransmisiones() {

    try {
        const response = await fetch(
            `assets/data/transmisiones.json?t=${Date.now()}`
        );

        if (!response.ok) {
            throw new Error("No se pudo cargar transmisiones.json");
        }

        return await response.json();

    } catch (error) {
        console.warn("No se pudo cargar transmisiones.json", error);
        return [];
    }
}

function clavePartido(local, visitante, fase) {
    return `${[local, visitante].sort().join(" vs ")} | ${fase}`;
}

function buscarTransmision(partido, transmisiones) {

    const exacta = transmisiones.find(item =>
        item.local &&
        item.visitante &&
        clavePartido(item.local, item.visitante, item.fase || partido.fase) ===
        clavePartido(partido.local, partido.visitante, partido.fase)
    );

    if (exacta) return exacta;

    const porFase = transmisiones.find(item =>
        !item.local &&
        !item.visitante &&
        item.fase === partido.fase
    );

    if (porFase) return porFase;

    const defaultTransmision = transmisiones.find(item => item.default);

    return defaultTransmision || {
        canales: []
    };
}

function aplicarTransmisiones(partidos, transmisiones) {

    return partidos.map(partido => ({
        ...partido,
        transmision: buscarTransmision(partido, transmisiones)
    }));
}

function crearIconosCanales(partido) {

    const canales = partido.transmision?.canales || [];

    if (canales.length === 0) {
        return "";
    }

    return `
        <div class="canales-partido">
            ${canales.map(canal => {
                const logo = logosCanales[canal];

                if (!logo) {
                    return `<span class="canal-texto">${canal}</span>`;
                }

                return `
                    <img 
                        src="${logo}" 
                        class="canal-logo" 
                        alt="${canal}" 
                        title="${canal}"
                    >
                `;
            }).join("")}
        </div>
    `;
}

function calcularEstadisticasEquipos(partidos) {

    const estadisticas = {};

    function asegurarEquipo(equipo) {
        if (!estadisticas[equipo]) {
            estadisticas[equipo] = {
                puntos: 0,
                golesFavor: 0
            };
        }
    }

    partidos.forEach(partido => {

        const esFaseGrupos =
            partido.fase &&
            partido.fase.startsWith("Grupo ");

        if (!esFaseGrupos) return;

        const estado = partido.estado || "programado";

        if (estado !== "finalizado" && estado !== "en-vivo") return;

        const tieneGoles =
            partido.golesLocal !== null &&
            partido.golesLocal !== undefined &&
            partido.golesVisitante !== null &&
            partido.golesVisitante !== undefined;

        if (!tieneGoles) return;

        const local = partido.local;
        const visitante = partido.visitante;

        const golesLocal = Number(partido.golesLocal);
        const golesVisitante = Number(partido.golesVisitante);

        asegurarEquipo(local);
        asegurarEquipo(visitante);

        estadisticas[local].golesFavor += golesLocal;
        estadisticas[visitante].golesFavor += golesVisitante;

        if (golesLocal > golesVisitante) {
            estadisticas[local].puntos += 3;
        } else if (golesVisitante > golesLocal) {
            estadisticas[visitante].puntos += 3;
        } else {
            estadisticas[local].puntos += 1;
            estadisticas[visitante].puntos += 1;
        }

    });

    return estadisticas;
}

const codigosEquipos = {
    "Argentina": "AR",
    "Arabia Saudita": "SA",
    "Argelia": "DZ",
    "Australia": "AU",
    "Austria": "AT",
    "Belgica": "BE",
    "Bosnia y Herzegovina": "BA",
    "Brasil": "BR",
    "Cabo Verde": "CV",
    "Canada": "CA",
    "Colombia": "CO",
    "Republica Democratica del Congo": "CD",
    "Corea del Sur": "KR",
    "Costa de Marfil": "CI",
    "Croacia": "HR",
    "Curazao": "CW",
    "Ecuador": "EC",
    "Egipto": "EG",
    "Escocia": "SCO",
    "España": "ES",
    "Estados Unidos": "USA",
    "Francia": "FR",
    "Ghana": "GH",
    "Haiti": "HT",
    "Inglaterra": "ENG",
    "Irak": "IQ",
    "Iran": "IR",
    "Japon": "JP",
    "Jordania": "JO",
    "Marruecos": "MA",
    "Mexico": "MX",
    "Noruega": "NO",
    "Nueva Zelanda": "NZ",
    "Paises Bajos": "NL",
    "Panama": "PA",
    "Paraguay": "PY",
    "Portugal": "PT",
    "Qatar": "QA",
    "Republica Checa": "CZ",
    "Senegal": "SN",
    "Sudafrica": "ZA",
    "Suecia": "SE",
    "Suiza": "CH",
    "Tunez": "TN",
    "Turquia": "TR",
    "Uruguay": "UY",
    "Uzbekistan": "UZ",
    "Alemania": "DE"
};

function codigoEquipo(equipo) {
    return codigosEquipos[equipo] || equipo.slice(0, 3).toUpperCase();
}

function fechaMexicoClave(fechaISO) {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Mexico_City",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date(fechaISO));
}

function horaMexicoCorta(fechaISO) {
    return new Date(fechaISO)
        .toLocaleTimeString("es-MX", {
            timeZone: "America/Mexico_City",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        })
        .replace("a. m.", "a.m.")
        .replace("p. m.", "p.m.")
        .replace("a. m.", "a.m.")
        .replace("p. m.", "p.m.");
}

function esFaseFinalPartido(fase) {
    return [
        "Dieciseisavos",
        "Octavos",
        "Cuartos",
        "Semifinales",
        "Final",
        "Tercer lugar"
    ].includes(fase);
}

function irASeccionPartido(partido) {

    const esFinal = esFaseFinalPartido(partido.fase);

    const detalle = document.getElementById(
        esFinal ? "fase-final-detalle" : "fase-grupos-detalle"
    );

    const contenedor = document.getElementById(
        esFinal ? "bracket-container" : "grupos-container"
    );

    if (detalle) {
        detalle.open = true;
    }

    const idPartido = crearIdPartido(partido);

    setTimeout(() => {

        const elementoPartido = document.getElementById(idPartido);

        if (!elementoPartido) {
            if (contenedor) {
                contenedor.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }

        elementoPartido.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });

        elementoPartido.classList.add("partido-destacado");

        setTimeout(() => {
            elementoPartido.classList.remove("partido-destacado");
        }, 2500);

    }, 250);
}

function activarClicksPartidosModal() {

    document
        .querySelectorAll("#modal-body .proximo-partido[data-partido-id]")
        .forEach(tarjeta => {

            tarjeta.addEventListener("click", () => {

                const idPartido = tarjeta.dataset.partidoId;

                const partido = partidosCargados.find(p =>
                    crearIdPartido(p) === idPartido
                );

                if (!partido) return;

                document.getElementById("modal").style.display = "none";

                irASeccionPartido(partido);

            });

        });
}

function textoSeguroId(texto) {
    return texto
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase();
}

function crearIdPartido(partido) {
    return `partido-${textoSeguroId(
        `${partido.fase}-${partido.local}-${partido.visitante}-${partido.fecha}`
    )}`;
}

function renderizarPartidosHoyHero(partidos) {

    const contenedor = document.getElementById("partidos-hoy-hero");

    if (!contenedor) return;

    const hoyMexico = fechaMexicoClave(new Date());

    const partidosHoy = partidos
        .filter(partido =>
            fechaMexicoClave(partido.fecha) === hoyMexico
        )
        .sort((a, b) =>
            new Date(a.fecha) - new Date(b.fecha)
        );

    if (partidosHoy.length === 0) {
        contenedor.innerHTML = `
            <div class="sin-partidos-hoy">
                No hay partidos hoy
            </div>
        `;
        return;
    }

    contenedor.innerHTML = `
        <div class="partidos-hoy-lista">
            ${partidosHoy.map((partido, index) => `
                <button class="partido-hoy-card" data-index="${index}" type="button">

                    <div class="partido-hoy-equipos">
                        <span>${banderas[partido.local] || "🏳️"} ${codigoEquipo(partido.local)}</span>
                        <strong>vs</strong>
                        <span>${banderas[partido.visitante] || "🏳️"} ${codigoEquipo(partido.visitante)}</span>
                    </div>

                    <div class="partido-hoy-hora">
                        ${horaMexicoCorta(partido.fecha)}
                    </div>

                </button>
            `).join("")}
        </div>
    `;

    contenedor
        .querySelectorAll(".partido-hoy-card")
        .forEach(boton => {

            boton.addEventListener("click", () => {

                const index = Number(
                    boton.dataset.index
                );

                irASeccionPartido(
                    partidosHoy[index]
                );

            });

        });
}

function abrirModalParticipante(persona, estados, partidos) {

    const foto = persona.foto
        ? `<img src="assets/fotos/${persona.foto}"
               style="width:120px;height:120px;border-radius:50%;object-fit:cover;">`
        : "";

    const equipos = persona.equipos
        .map(e => {

            const estado = estados[e] || "vivo";

            return `
                <div class="equipo ${estado}">
                    ${banderas[e] || "🏳️"} ${nombrePais(e)}
                </div>
            `;

        })
        .join("");

    const resumenParticipante = `
        <div class="modal-resumen-linea">
            <span>⭐ <strong>${persona.puntos}</strong> puntos</span>
            <span class="separador-modal">·</span>
            <span>⚽ <strong>${persona.golesFavor}</strong> goles a favor</span>
        </div>
    `;

    const proximosPartidosHTML = crearHTMLProximosPartidos(
        persona,
        partidos
    );

    document.getElementById("modal-body").innerHTML = `
        <div style="text-align:center">

            ${foto}

            <h2>${persona.nombre}</h2>

            <div class="modal-equipos">
                ${equipos}
            </div>

            ${resumenParticipante}

            ${proximosPartidosHTML}

        </div>
    `;

    document.getElementById("modal").style.display = "block";

    activarClicksPartidosModal();
}

async function cargarParticipantes() {

    const response = await fetch("assets/data/participantes.json");
    const participantes = await response.json();
    const estadosResponse = await fetch("assets/data/estados.json");
    const estadosManual = await estadosResponse.json();

    const partidosBase = await cargarPartidosAutomaticos();
const transmisiones = await cargarTransmisiones();

const partidos = aplicarTransmisiones(
    partidosBase,
    transmisiones
);
    partidosCargados = partidos;

    const estados = calcularEstadosAutomaticos(
        partidos,
        estadosManual
    );

    const estadisticasEquipos = calcularEstadisticasEquipos(partidos);

    renderizarFaseGrupos(partidos, participantes, estados);
    renderizarBracket(partidos, participantes, estados);
    renderizarPartidosHoyHero(partidos);

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
    let subcampeon = null;
    let tercerLugar = null;

participantes.forEach(participante => {

let vivosPersona = 0;
let puntosPersona = 0;
let golesFavorPersona = 0;
let tieneCampeon = false;
let tieneSubcampeon = false;
let tieneTercerLugar = false;

    participante.equipos.forEach(equipo => {

        totalEquipos++;

        const estado = estados[equipo] || "vivo";

        const estadisticaEquipo = estadisticasEquipos[equipo] || {
    puntos: 0,
    golesFavor: 0
};

puntosPersona += estadisticaEquipo.puntos;
golesFavorPersona += estadisticaEquipo.golesFavor;

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

if (estado === "subcampeon") {
    subcampeon = equipo;
    tieneSubcampeon = true;
}

if (estado === "tercer-lugar") {
    tercerLugar = equipo;
    tieneTercerLugar = true;
}

    });

participante.equiposVivos = vivosPersona;
participante.puntos = puntosPersona;
participante.golesFavor = golesFavorPersona;
participante.tieneCampeon = tieneCampeon;
participante.tieneSubcampeon = tieneSubcampeon;
participante.tieneTercerLugar = tieneTercerLugar;

});

document.getElementById("monto-premio").textContent =
    MONTO_PREMIO;;

document.getElementById("equipos-eliminados").textContent =
    equiposVivos;

function prioridadPodio(persona) {
    if (persona.tieneCampeon) return 3;
    if (persona.tieneSubcampeon) return 2;
    if (persona.tieneTercerLugar) return 1;
    return 0;
}

const ranking = [...participantes].sort((a, b) => {

    const prioridadA = prioridadPodio(a);
    const prioridadB = prioridadPodio(b);

    if (prioridadB !== prioridadA) {
        return prioridadB - prioridadA;
    }

    if (b.equiposVivos !== a.equiposVivos) {
        return b.equiposVivos - a.equiposVivos;
    }

    if (b.puntos !== a.puntos) {
        return b.puntos - a.puntos;
    }

    if (b.golesFavor !== a.golesFavor) {
        return b.golesFavor - a.golesFavor;
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
            <span class="ranking-bandera ${estado}" title="${nombrePais(equipo)}">
                ${banderas[equipo] || "🏳️"}
            </span>
        `;
    })
    .join("");

    const textoPremio = persona.tieneCampeon
    ? "🏆 Tiene al campeón"
    : persona.tieneSubcampeon
        ? "🥈 Tiene al subcampeón"
        : persona.tieneTercerLugar
            ? "🥉 Tiene al tercer lugar"
            : "";

const textoEstadisticas = `🟢 ${persona.equiposVivos} vivos · ⭐ ${persona.puntos} puntos · ⚽ ${persona.golesFavor} goles`;

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
    ${textoPremio ? `${textoPremio}<br>` : ""}
    ${textoEstadisticas}
</small>

        </div>

    </div>
`;

item.addEventListener("click", () => {
    abrirModalParticipante(persona, estados, partidos);
});

        rankingContainer.appendChild(item);

    });

    actualizarPodio(
    ranking,
    campeon,
    subcampeon,
    tercerLugar,
    estados,
    partidos
);
    
}

function actualizarPodio(ranking, campeon, subcampeon, tercerLugar, estados, partidos) {

    const primero = ranking.find(persona => persona.tieneCampeon) || ranking[0];
    const segundo = ranking.find(persona => persona.tieneSubcampeon) || ranking[1];
    const tercero = ranking.find(persona => persona.tieneTercerLugar) || ranking[2];

    function crearPodioCard(persona, posicion, etiqueta, equipoPremiado) {

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

        const textoEstado = equipoPremiado
            ? `${banderas[equipoPremiado] || "🏳️"} ${nombrePais(equipoPremiado)}`
            : `
                <span class="podio-stats-linea">
                    🟢 ${persona.equiposVivos} vivos · ⭐ ${persona.puntos} puntos
                </span>
                <span class="podio-stats-linea podio-goles-linea">
                    ⚽ ${persona.golesFavor} goles
                </span>
            `;

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
        crearPodioCard(
            primero,
            "🥇",
            campeon ? "Campeón del Mundial" : "Primer lugar provisional",
            campeon
        );

    document.getElementById("segundo").innerHTML =
        crearPodioCard(
            segundo,
            "🥈",
            subcampeon ? "Subcampeón del Mundial" : "Segundo lugar provisional",
            subcampeon
        );

    document.getElementById("tercero").innerHTML =
        crearPodioCard(
            tercero,
            "🥉",
            tercerLugar ? "Tercer lugar del Mundial" : "Tercer lugar provisional",
            tercerLugar
        );

    [
        { id: "primero", persona: primero },
        { id: "segundo", persona: segundo },
        { id: "tercero", persona: tercero }
    ].forEach(item => {

        const elemento = document.getElementById(item.id);

        if (!elemento || !item.persona) return;

        elemento.style.cursor = "pointer";

        elemento.onclick = () => {
            abrirModalParticipante(
                item.persona,
                estados,
                partidos
            );
        };

    });
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

function obtenerMarcadorPartido(partido) {

    const tieneGoles =
        partido.golesLocal !== null &&
        partido.golesLocal !== undefined &&
        partido.golesVisitante !== null &&
        partido.golesVisitante !== undefined;

    if (tieneGoles) {
        return `${partido.golesLocal} - ${partido.golesVisitante}`;
    }

    const estado = partido.estado || "programado";

    if (estado === "en-vivo") {
        return "-";
    }

    return "vs";
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

const marcador = obtenerMarcadorPartido(partido);

            const textoEstado = estado
                .replace("-", " ")
                .toUpperCase();

            return `
                <div class="proximo-partido" data-partido-id="${crearIdPartido(partido)}">

                    <div class="partido-equipos">
                        ${banderas[partido.local] || "🏳️"} ${nombrePais(partido.local)}
                        <span>${marcador}</span>
                        ${banderas[partido.visitante] || "🏳️"} ${nombrePais(partido.visitante)}
                    </div>

                    <div class="partido-detalle">
                        📅 ${fecha}
                    </div>

                    <div class="partido-fase">
                        ${partido.fase}
                    </div>

                    <div class="partido-footer">
    <div class="estado-partido ${estado}">
        ${textoEstado}
    </div>

    ${crearIconosCanales(partido)}
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

function activarClicksDuenosPartidos(contenedor, participantes, estados, partidos) {

    if (!contenedor) return;

    contenedor
        .querySelectorAll("[data-dueno]")
        .forEach(elemento => {

            elemento.style.cursor = "pointer";

            elemento.addEventListener("click", event => {

                event.stopPropagation();

                const nombreDueno = elemento.dataset.dueno;

                const persona = participantes.find(p =>
                    p.nombre === nombreDueno
                );

                if (!persona) return;

                abrirModalParticipante(
                    persona,
                    estados,
                    partidos
                );

            });

        });
}

function renderizarFaseGrupos(partidos, participantes, estados) {

    if (!gruposContainer) return;

    const grupos = [
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
        "Grupo L"
    ];

    function obtenerDuenoEquipo(equipo) {
        return participantes.find(persona =>
            persona.equipos.includes(equipo)
        );
    }

    function crearEquipoGrupo(equipo) {

        const dueno = obtenerDuenoEquipo(equipo);

        const fotoDueno = dueno
            ? (
                dueno.foto
                    ? `<img src="assets/fotos/${dueno.foto}" class="grupo-dueno-foto dueno-clickable" title="${dueno.nombre}" data-dueno="${dueno.nombre}">`
                    : `<div class="grupo-dueno-foto grupo-dueno-sin-foto dueno-clickable" title="${dueno.nombre}" data-dueno="${dueno.nombre}">?</div>`
            )
            : "";

        return `
            <div class="grupo-equipo">
                <span>${banderas[equipo] || "🏳️"} ${nombrePais(equipo)}</span>
                ${fotoDueno}
            </div>
        `;
    }

    function crearPartidoGrupo(partido) {

        const estado = partido.estado || "programado";

        const marcador =
            estado === "finalizado" || estado === "en-vivo"
                ? `${partido.golesLocal} - ${partido.golesVisitante}`
                : "vs";

        const textoEstado = estado
            .replace("-", " ")
            .toUpperCase();

        return `
            <div class="grupo-partido" id="${crearIdPartido(partido)}">

                ${crearEquipoGrupo(partido.local)}

                <div class="grupo-marcador">${marcador}</div>

                ${crearEquipoGrupo(partido.visitante)}

                <div class="grupo-fecha">
                    📅 ${formatearFechaPartido(partido.fecha)}
                </div>

                <div class="partido-footer">
    <div class="estado-partido ${estado}">
        ${textoEstado}
    </div>

    ${crearIconosCanales(partido)}
</div>

            </div>
        `;
    }

    const htmlGrupos = grupos
        .map(grupo => {

            const partidosGrupo = partidos
                .filter(partido => partido.fase === grupo)
                .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

            if (partidosGrupo.length === 0) return "";

            return `
                <div class="grupo-card">
                    <h3>${grupo}</h3>
                    ${partidosGrupo.map(crearPartidoGrupo).join("")}
                </div>
            `;

        })
        .join("");

    gruposContainer.innerHTML = htmlGrupos || `
        <p>No hay partidos de fase de grupos cargados todavía.</p>
    `;
    activarClicksDuenosPartidos(
    gruposContainer,
    participantes,
    estados,
    partidos
);
}

function renderizarBracket(partidos, participantes, estados) {

    if (!bracketContainer) return;

    const fasesKnockout = [
        "Dieciseisavos",
        "Octavos",
        "Cuartos",
        "Semifinales",
        "Final",
        "Tercer lugar"
    ];

    const partidosKnockout = partidos
        .filter(partido => fasesKnockout.includes(partido.fase))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    function obtenerDuenoEquipo(equipo) {
        return participantes.find(persona =>
            persona.equipos.includes(equipo)
        );
    }

    function completarSlots(lista, cantidad) {
        const resultado = [...lista];

        while (resultado.length < cantidad) {
            resultado.push(null);
        }

        return resultado.slice(0, cantidad);
    }

    function crearEquipoHTML(equipo) {

        const equipoReal = equipo || "Por definir";
        const esPorDefinir = equipoReal === "Por definir";

        const dueno = esPorDefinir
            ? null
            : obtenerDuenoEquipo(equipoReal);

        const fotoDueno = dueno
            ? (
                dueno.foto
                    ? `<img src="assets/fotos/${dueno.foto}" class="bracket-owner-photo dueno-clickable" title="${dueno.nombre}" data-dueno="${dueno.nombre}">`
                    : `<div class="bracket-owner-photo bracket-owner-empty dueno-clickable" title="${dueno.nombre}" data-dueno="${dueno.nombre}">?</div>`
            )
            : `<div class="bracket-owner-photo bracket-owner-empty">-</div>`;

        return `
            <div class="bracket-team">
                <div class="bracket-team-main">
                    <span class="bracket-team-flag">${banderas[equipoReal] || "🏳️"}</span>
                    <span class="bracket-team-name">${equipoReal}</span>
                </div>
                ${fotoDueno}
            </div>
        `;
    }

    function crearMatchHTML(partido, rondaClase, estiloGrid, etiqueta) {

        if (!partido) {
            return `
                <div class="bracket-match bracket-placeholder ${rondaClase}" style="${estiloGrid}">
                    <span class="bracket-connector-in"></span>
                    <span class="bracket-connector-out"></span>
                    <span class="bracket-connector-vertical"></span>

                    <div class="bracket-placeholder-title">${etiqueta}</div>
                    <div class="bracket-placeholder-text">Por definir</div>
                </div>
            `;
        }

        const estado = partido.estado || "programado";

        const marcador =
            estado === "finalizado" || estado === "en-vivo"
                ? `${partido.golesLocal} - ${partido.golesVisitante}`
                : "vs";

        const textoEstado = estado
            .replace("-", " ")
            .toUpperCase();

        return `
    <div id="${crearIdPartido(partido)}" class="bracket-match ${rondaClase}" style="${estiloGrid}">
                <span class="bracket-connector-in"></span>
                <span class="bracket-connector-out"></span>
                <span class="bracket-connector-vertical"></span>

                ${crearEquipoHTML(partido.local)}

                <div class="bracket-score">${marcador}</div>

                ${crearEquipoHTML(partido.visitante)}

<div class="bracket-meta">
    <div>📅 ${formatearFechaPartido(partido.fecha)}</div>

    <div class="bracket-footer">
        <div class="bracket-phase-status ${estado}">
            ${textoEstado}
        </div>

        ${crearIconosCanales(partido)}
    </div>
</div>
            </div>
        `;
    }

    const dieciseisavos = partidosKnockout.filter(p => p.fase === "Dieciseisavos");
    const octavos = partidosKnockout.filter(p => p.fase === "Octavos");
    const cuartos = partidosKnockout.filter(p => p.fase === "Cuartos");
    const semifinales = partidosKnockout.filter(p => p.fase === "Semifinales");
    const final = partidosKnockout.filter(p => p.fase === "Final");
    const tercerLugar = partidosKnockout.filter(p => p.fase === "Tercer lugar");

    const izquierda = {
        dieciseisavos: completarSlots(dieciseisavos.slice(0, 8), 8),
        octavos: completarSlots(octavos.slice(0, 4), 4),
        cuartos: completarSlots(cuartos.slice(0, 2), 2),
        semifinales: completarSlots(semifinales.slice(0, 1), 1)
    };

    const derecha = {
        dieciseisavos: completarSlots(dieciseisavos.slice(8, 16), 8),
        octavos: completarSlots(octavos.slice(4, 8), 4),
        cuartos: completarSlots(cuartos.slice(2, 4), 2),
        semifinales: completarSlots(semifinales.slice(1, 2), 1)
    };

    function crearLadoIzquierdo() {

        const html = [];

        html.push(`<div class="round-title" style="grid-column:1;grid-row:1;">1/16</div>`);
        html.push(`<div class="round-title" style="grid-column:2;grid-row:1;">Octavos</div>`);
        html.push(`<div class="round-title" style="grid-column:3;grid-row:1;">Cuartos</div>`);
        html.push(`<div class="round-title" style="grid-column:4;grid-row:1;">Semis</div>`);

        izquierda.dieciseisavos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-32",
                    `grid-column:1; grid-row:${index * 2 + 2} / span 2;`,
                    "1/16"
                )
            );
        });

        izquierda.octavos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-16",
                    `grid-column:2; grid-row:${index * 4 + 3} / span 2;`,
                    "Octavos"
                )
            );
        });

        izquierda.cuartos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-8",
                    `grid-column:3; grid-row:${index * 8 + 5} / span 2;`,
                    "Cuartos"
                )
            );
        });

        izquierda.semifinales.forEach((partido) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-4",
                    `grid-column:4; grid-row:9 / span 2;`,
                    "Semifinal"
                )
            );
        });

        return `
            <div class="knockout-side knockout-left">
                ${html.join("")}
            </div>
        `;
    }

    function crearLadoDerecho() {

        const html = [];

        html.push(`<div class="round-title" style="grid-column:1;grid-row:1;">Semis</div>`);
        html.push(`<div class="round-title" style="grid-column:2;grid-row:1;">Cuartos</div>`);
        html.push(`<div class="round-title" style="grid-column:3;grid-row:1;">Octavos</div>`);
        html.push(`<div class="round-title" style="grid-column:4;grid-row:1;">1/16</div>`);

        derecha.semifinales.forEach((partido) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-4",
                    `grid-column:1; grid-row:9 / span 2;`,
                    "Semifinal"
                )
            );
        });

        derecha.cuartos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-8",
                    `grid-column:2; grid-row:${index * 8 + 5} / span 2;`,
                    "Cuartos"
                )
            );
        });

        derecha.octavos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-16",
                    `grid-column:3; grid-row:${index * 4 + 3} / span 2;`,
                    "Octavos"
                )
            );
        });

        derecha.dieciseisavos.forEach((partido, index) => {
            html.push(
                crearMatchHTML(
                    partido,
                    "ronda-32",
                    `grid-column:4; grid-row:${index * 2 + 2} / span 2;`,
                    "1/16"
                )
            );
        });

        return `
            <div class="knockout-side knockout-right">
                ${html.join("")}
            </div>
        `;
    }

function crearCentro() {

    return `
        <div class="knockout-center">

            <div class="round-title final-title" style="grid-column:1;grid-row:1;">
                Final
            </div>

            ${crearMatchHTML(
                final[0] || null,
                "ronda-final final-card",
                "grid-column:1; grid-row:9 / span 2;",
                "Final"
            )}

            <div class="round-title third-place-title" style="grid-column:1;grid-row:12;">
                Tercer lugar
            </div>

            ${crearMatchHTML(
                tercerLugar[0] || null,
                "ronda-tercero tercer-lugar-card",
                "grid-column:1; grid-row:13 / span 2;",
                "Tercer lugar"
            )}

        </div>
    `;
}

    bracketContainer.innerHTML = `
        <div class="bracket-scroll">
            ${crearLadoIzquierdo()}
            ${crearCentro()}
            ${crearLadoDerecho()}
        </div>
    `;
    activarClicksDuenosPartidos(
    bracketContainer,
    participantes,
    estados,
    partidos
);
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

function normalizarEstadoPartido(estado) {

    if (!estado) return null;

    const estadoLimpio = estado
        .toString()
        .toLowerCase()
        .trim();

    if (
        estadoLimpio === "en vivo" ||
        estadoLimpio === "en-vivo" ||
        estadoLimpio === "live"
    ) {
        return "en-vivo";
    }

    if (
        estadoLimpio === "finalizado" ||
        estadoLimpio === "complete" ||
        estadoLimpio === "completed" ||
        estadoLimpio === "finished"
    ) {
        return "finalizado";
    }

    if (
        estadoLimpio === "programado" ||
        estadoLimpio === "scheduled"
    ) {
        return "programado";
    }

    return estadoLimpio.replaceAll(" ", "-");
}

function calcularEstadoPorHorario(fechaISO, tieneMarcador) {

    if (tieneMarcador) {
        return "finalizado";
    }

    if (!fechaISO) {
        return "programado";
    }

    const ahora = new Date();
    const inicio = new Date(fechaISO);

    const finEstimado = new Date(
        inicio.getTime() + 3 * 60 * 60 * 1000
    );

    if (ahora >= inicio && ahora <= finEstimado) {
        return "en-vivo";
    }

    return "programado";
}

function transformarPartidoOpenFootball(partido) {

    const local = normalizarNombreEquipo(partido.team1);
    const visitante = normalizarNombreEquipo(partido.team2);

    const fecha = convertirFechaOpenFootball(
        partido.date,
        partido.time
    );

    const tieneMarcador =
        partido.score &&
        partido.score.ft &&
        Array.isArray(partido.score.ft);

    const estadoAPI = normalizarEstadoPartido(
        partido.status || partido.estado
    );

    const estado = estadoAPI || calcularEstadoPorHorario(
        fecha,
        tieneMarcador
    );

    return {
        local: local,
        visitante: visitante,
        fecha: fecha,
        fase: convertirFase(partido),
        estado: estado,
        golesLocal: tieneMarcador ? partido.score.ft[0] : null,
        golesVisitante: tieneMarcador ? partido.score.ft[1] : null
    };
}

function normalizarPartidosLocales(partidos) {

    return partidos.map(partido => {

        const tieneMarcador =
            partido.golesLocal !== null &&
            partido.golesLocal !== undefined &&
            partido.golesVisitante !== null &&
            partido.golesVisitante !== undefined;

        const estado = normalizarEstadoPartido(partido.estado) ||
            calcularEstadoPorHorario(partido.fecha, tieneMarcador);

        return {
            ...partido,
            estado: estado
        };

    });
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

        fuentePartidos = "API automática";
        ultimaCargaPartidos = new Date();
        mostrarInfoDatos();

        return data.matches.map(transformarPartidoOpenFootball);

    } catch (error) {

        console.warn(
            "No se pudo cargar OpenFootball. Usando partidos.json local.",
            error
        );

        const partidosResponse = await fetch(
            `assets/data/partidos.json?t=${Date.now()}`
        );

        fuentePartidos = "respaldo local";
        ultimaCargaPartidos = new Date();
        mostrarInfoDatos();

        const partidosLocales = await partidosResponse.json();

return normalizarPartidosLocales(partidosLocales);
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

    const partidosEliminacion = partidos
        .filter(partido =>
            fasesEliminacion.includes(partido.fase) &&
            partido.estado === "finalizado"
        )
        .sort((a, b) =>
            new Date(a.fecha) - new Date(b.fecha)
        );

    partidosEliminacion.forEach(partido => {

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

        if (!ganador || !perdedor) return;

        if (partido.fase === "Final") {
            estados[ganador] = "campeon";
            estados[perdedor] = "subcampeon";
            return;
        }

        if (partido.fase === "Tercer lugar") {
            estados[ganador] = "tercer-lugar";
            estados[perdedor] = "eliminado";
            return;
        }

        estados[ganador] = "vivo";
        estados[perdedor] = "eliminado";

    });

    return estados;
}

function mostrarInfoDatos() {

    const infoDatos = document.getElementById("info-datos");

    if (!infoDatos) return;

    const fecha = ultimaCargaPartidos
        ? ultimaCargaPartidos.toLocaleString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/Mexico_City"
        })
        : "No disponible";

    infoDatos.innerHTML = `
    📡 <strong>${fuentePartidos}</strong> · ${fecha}
`;
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
