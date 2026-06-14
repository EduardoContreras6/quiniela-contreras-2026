const participantesContainer = document.getElementById("participantes-container");
const rankingContainer = document.getElementById("ranking-container");

async function cargarParticipantes() {

    const response = await fetch("assets/data/participantes.json");
    const participantes = await response.json();

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
                <div class="equipo">
                    ⚽ ${equipo}
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

    const ranking = [...participantes]
        .sort((a, b) => b.equipos.length - a.equipos.length);

    ranking.forEach((persona, index) => {

        const item = document.createElement("div");

        item.className = "ranking-item";

        item.innerHTML = `
            <strong>#${index + 1}</strong>
            ${persona.nombre}
            (${persona.equipos.length} equipos)
        `;

        rankingContainer.appendChild(item);

    });

    document.getElementById("lider-actual").textContent =
        ranking[0].nombre;
}

cargarParticipantes();
