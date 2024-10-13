document.addEventListener('DOMContentLoaded', () => {
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

    const currentIndex = {
        '1-5': 1,
        '6-10': 6,
        '11-15': 11
    };

    async function* getCharacters(range) {
        const [start, end] = range.split('-').map(Number);
        for (let id = start; id <= end; id++) {
            yield await getCharacter(id);
        }
    }

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

    function displayCharacter(character, section) {
        if (character) {
            const div = document.createElement('div');
            div.classList.add('character');
            div.innerHTML = `
                <h3>${character.name}</h3>
                <p>Altura: ${character.height} cm</p>
                <p>Peso: ${character.mass} kg</p>
            `;

            const currentCharacters = section.children.length;
            if (currentCharacters < 10) {
                section.appendChild(div);
            }
        }
    }

    ranges.forEach(range => {
        const rangeText = range.getAttribute('data-range');
        const section = sections[rangeText];

        const characterGenerator = getCharacters(rangeText);
        let character = null;

        range.addEventListener('mouseover', async () => {
            character = await characterGenerator.next();

            if (!character.done) {
                displayCharacter(character.value, section);
                currentIndex[rangeText]++;
            }
        });
    });
});
