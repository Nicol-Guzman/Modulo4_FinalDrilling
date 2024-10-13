document.addEventListener('DOMContentLoaded', () => {
    // Función para añadir y animar el lightsaber
    const lightsaberDivider = document.getElementById('lightsaber');
    const lightsaber = document.createElement('div');
    lightsaber.classList.add('lightsaber');
    lightsaberDivider.appendChild(lightsaber); // Añadir el lightsaber al DOM

    const ranges = document.querySelectorAll('.range');
    const sections = {
        '1-5': document.querySelector('#section-1-5 .characters'),
        '6-10': document.querySelector('#section-6-10 .characters'),
        '11-15': document.querySelector('#section-11-15 .characters')
    };

    // Índice para controlar cuál personaje mostrar en cada rango
    const currentIndex = {
        '1-5': 1,
        '6-10': 6,
        '11-15': 11
    };

    // Función generadora para obtener los personajes de la API
    async function* getCharacters(range) {
        const [start, end] = range.split('-').map(Number);
        for (let id = start; id <= end; id++) {
            yield await getCharacter(id);
        }
    }

    // Función para obtener los personajes de la API por id
    async function getCharacter(id) {
        try {
            const response = await fetch(`https://swapi.dev/api/people/${id}/`);
            if (!response.ok) throw new Error('Error en la API');
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Función para mostrar la información de un personaje en su sección correspondiente
    function displayCharacter(character, section) {
        if (character) {
            const div = document.createElement('div');
            div.classList.add('character');
            div.innerHTML = `
                <h3>${character.name}</h3>
                <p>Altura: ${character.height} cm</p>
                <p>Peso: ${character.mass} kg</p>
            `;
            // Verifica la cantidad de personajes actuales antes de añadir
            const currentCharacters = section.children.length;
            if (currentCharacters < 10) { // Limita el número de personajes a mostrar
                section.appendChild(div);
            }
        }
    }

    // Manejar evento de mouseover en los botones de rango
    ranges.forEach(range => {
        const rangeText = range.getAttribute('data-range');
        const section = sections[rangeText];

        // Crear una instancia del generador para el rango correspondiente
        const characterGenerator = getCharacters(rangeText);
        let character = null; // Variable para almacenar el personaje actual

        range.addEventListener('mouseover', async () => {
            // Obtener el siguiente personaje usando el generador
            character = await characterGenerator.next();

            // Solo mostrar el personaje si no se ha llegado al final
            if (!character.done) {
                displayCharacter(character.value, section);
                // Incrementar el índice para el siguiente personaje la próxima vez
                currentIndex[rangeText]++;
            }
        });
    });
});
