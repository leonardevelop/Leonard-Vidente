document.addEventListener('DOMContentLoaded', () => {
    const altarContainer = document.querySelector('.altar-container');
    if (!altarContainer) {
        return; 
    }

    const API_KEY = "AIzaSyBiroBOhAWSSKUc8m5Wfl2AESsrcuS2i-Y"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const majorArcana = [
        { name: 'El Loco', meaning: 'Nuevos comienzos, fe en el futuro, inexperiencia, aventura.', miniMeaning: 'Aventura audaz, nuevos comienzos.' },
        { name: 'El Mago', meaning: 'Manifestación, poder, recursos, habilidad, acción.', miniMeaning: 'Poder para crear, habilidad manifestadora.' },
        { name: 'La Sacerdotisa', meaning: 'Intuición, misterio, subconsciente, sabiduría oculta.', miniMeaning: 'Intuición profunda, sabiduría oculta.' },
        { name: 'La Emperatriz', meaning: 'Fertilidad, abundancia, naturaleza, nutrición, creatividad.', miniMeaning: 'Abundancia, creatividad, nutrición.' },
        { name: 'El Emperador', meaning: 'Autoridad, estructura, control, paternidad, solidez.', miniMeaning: 'Liderazgo, estructura, estabilidad.' },
        { name: 'El Hierofante', meaning: 'Tradición, conformidad, instituciones, guía espiritual.', miniMeaning: 'Guía sabia, enseñanza, tradición.' },
        { name: 'Los Enamorados', meaning: 'Amor, armonía, relaciones, valores, decisiones.', miniMeaning: 'Elección de amor, conexión profunda.' },
        { name: 'El Carro', meaning: 'Victoria, control, voluntad, determinación, éxito.', miniMeaning: 'Victoria, determinación, avance.' },
        { name: 'La Fuerza', meaning: 'Coraje, compasión, enfoque, paciencia, control interior.', miniMeaning: 'Coraje interior, compasión.' },
        { name: 'La Rueda de la Fortuna', meaning: 'Ciclos, destino, punto de inflexión, suerte, cambio.', miniMeaning: 'Cambio de suerte, nuevas oportunidades.' },
        { name: 'La Justicia', meaning: 'Equidad, verdad, causa y efecto, ley, claridad.', miniMeaning: 'Equidad, verdad, equilibrio.' },
        { name: 'El Colgado', meaning: 'Sacrificio, nueva perspectiva, suspensión, dejarse llevar.', miniMeaning: 'Nueva perspectiva, soltar control.' },
        { name: 'La Muerte', meaning: 'Fin de un ciclo, transformación, transición, cambio inevitable.', miniMeaning: 'Transformación, fin de ciclos, renacer.' },
        { name: 'La Templanza', meaning: 'Equilibrio, paciencia, moderación, propósito, armonía.', miniMeaning: 'Armonía, moderación, paciencia.' },
        { name: 'El Diablo', meaning: 'Ataduras, adicción, materialismo, tentación, ilusión.', miniMeaning: 'Libertad de ataduras, autenticidad.' },
        { name: 'La Torre', meaning: 'Cambio súbito, revelación, caos, liberación, despertar.', miniMeaning: 'Despertar, cambio radical, liberación.' },
        { name: 'La Estrella', meaning: 'Esperanza, fe, renovación, inspiración, serenidad.', miniMeaning: 'Esperanza, inspiración, guía divina.' },
        { name: 'La Luna', meaning: 'Miedo, ilusión, intuición, subconsciente, confusión.', miniMeaning: 'Intuición, misterio, verdad interna.' },
        { name: 'El Sol', meaning: 'Alegría, éxito, vitalidad, claridad, optimismo.', miniMeaning: 'Alegría, éxito, vitalidad radiante.' },
        { name: 'El Juicio', meaning: 'Renacimiento, evaluación, despertar, propósito, absolución.', miniMeaning: 'Renacimiento, despertar espiritual.' },
        { name: 'El Mundo', meaning: 'Culminación, integración, realización, viaje, éxito.', miniMeaning: 'Totalidad, culminación, éxito.' },
        { name: 'El Ermitaño', meaning: 'Introspección, guía interior, soledad, búsqueda del alma.', miniMeaning: 'Sabiduría interior, guía, introspección.' }
    ];

    const selectionView = document.getElementById('selection-view');
    const interpretationView = document.getElementById('interpretation-view');
    const cardSpreadContainer = document.getElementById('card-spread');
    const chosenCardsDisplay = document.getElementById('chosen-cards-display');
    const resetButton = document.getElementById('reset-button');
    const geminiTitle = document.getElementById('geminiTitle');
    const geminiTextElem = document.getElementById('geminiText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    let chosenCardsData = [];
    let chosenCardElements = [];

    function createCards() {
        cardSpreadContainer.innerHTML = '';
        cardSpreadContainer.classList.add('initial');
        chosenCardsData = [];
        chosenCardElements = [];
        for (let i = 0; i < 3; i++) {
            const card = document.createElement('div');
            card.classList.add('tarot-card');
            card.innerHTML = `<div class="card-inner"><div class="card-face card-back"></div><div class="card-face card-front"></div></div>`;
            card.addEventListener('click', () => selectCard(card));
            cardSpreadContainer.appendChild(card);
        }
    }

    function selectCard(selectedCardElement) {
        if (chosenCardsData.length >= 3 || selectedCardElement.classList.contains('chosen')) return;
        selectedCardElement.classList.add('chosen');
        let cardData;
        do {
            cardData = majorArcana[Math.floor(Math.random() * majorArcana.length)];
        } while (chosenCardsData.some(c => c.name === cardData.name));
        chosenCardsData.push(cardData);
        chosenCardElements.push(selectedCardElement);
        setTimeout(() => {
            const cardFront = selectedCardElement.querySelector('.card-front');
            cardFront.innerHTML = `<p class="name">${cardData.name}</p><p class="mini-meaning">${cardData.miniMeaning}</p>`;
        }, 250);
        if (chosenCardsData.length === 3) {
            setTimeout(showInterpretation, 800);
        }
    }

    function showInterpretation() {
        selectionView.style.display = 'none';
        interpretationView.style.display = 'flex';
        chosenCardsDisplay.innerHTML = '';
        geminiTitle.style.display = 'none';
        geminiTextElem.textContent = '';
        resetButton.style.display = 'none';
        chosenCardElements.forEach(cardEl => {
            const clone = cardEl.cloneNode(true);
            clone.classList.add('chosen');
            clone.style.cursor = 'default';
            chosenCardsDisplay.appendChild(clone);
        });
        interpretSpread();
    }

    async function interpretSpread() {
        loadingSpinner.classList.add('active');
        const [pastCard, presentCard, futureCard] = chosenCardsData;
        const prompt = `Soy Leonard Vidente. Dame una interpretación espiritual, consciente y muy positiva de una tirada de tarot de 3 cartas (Pasado, Presente, Futuro) para que el consultante se sienta identificado y empoderado. Basado en esta tirada: - Pasado: ${pastCard.name} (${pastCard.meaning}) - Presente: ${presentCard.name} (${presentCard.meaning}) - Futuro: ${futureCard.name} (${futureCard.meaning}). Genera un párrafo de 150-200 palabras. Enfócate en el crecimiento personal y las oportunidades. Usa un tono místico pero claro, como un vidente sabio. No incluyas saludos ni despedidas, ve directo a la interpretación.`;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
            });
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            const result = await response.json();
            const interpretationText = result.candidates[0].content.parts[0].text;
            geminiTextElem.textContent = interpretationText;
        } catch (error) {
            console.error("Error al llamar a la API de Gemini:", error);
            geminiTextElem.textContent = "Hubo un error al conectar con el oráculo. Por favor, verifica tu conexión e inténtalo de nuevo más tarde.";
        } finally {
            loadingSpinner.classList.remove('active');
            geminiTitle.style.display = 'block';
            resetButton.style.display = 'inline-block';
        }
    }

    function resetReading() {
        interpretationView.style.display = 'none';
        selectionView.style.display = 'flex';
        createCards();
    }
    
    resetButton.addEventListener('click', resetReading);
    createCards();
});