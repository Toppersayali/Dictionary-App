const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML="Fetching data ....";
        // Fetch data from API
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        
        // Debug: log the entire API response
        console.log('API Response:', data);
        
        if (data[0] && data[0].meanings[0] && data[0].meanings[0].definitions[0]) {
            let definitions = data[0].meanings[0].definitions[0];
            let antonyms = definitions.antonyms || [];
            let synonyms = definitions.synonyms || [];

            resultDiv.innerHTML = `
                <h2><strong>Word:</strong> ${data[0].word}</h2>
                <p><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}</p>
                <p><strong>Meaning:</strong> ${definitions.definition || "Not found"}</p>
                <p><strong>Example:</strong> ${definitions.example || "Not found"}</p>
                <p><strong>Antonyms:</strong></p>
                <ul id="antonyms-list">
            `;

            // Displaying Antonyms
            if (antonyms.length > 0) {
                antonyms.forEach(antonym => {
                    resultDiv.innerHTML += `<li>${antonym}</li>`;
                });
            } else {
                resultDiv.innerHTML += '<li>Not found</li>';
            }

            // Add Antonyms section
            resultDiv.innerHTML += `
                </ul>
                <p><strong>Synonyms:</strong></p>
                <ul id="synonyms-list">
            `;

            // Displaying Synonyms
            if (synonyms.length > 0) {
                synonyms.forEach(synonym => {
                    resultDiv.innerHTML += `<li>${synonym}</li>`;
                });
            } else {
                resultDiv.innerHTML += '<li>Not found</li>';
            }

            // Adding read more
            resultDiv.innerHTML += `
                </ul>
                <div><a href="${data[0].sourceUrls[0]}" target="_blank">Read more</a></div>
            `;
        } else {
            resultDiv.innerHTML = '<p>No definitions found for this word.</p>';
        }
    } catch (error) {
        // Debug: log the error
        console.error('Error fetching word info:', error);
        resultDiv.innerHTML = '<p>Sorry, the word could not be found.</p>';
    }
};

