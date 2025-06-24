// Get references to our HTML elements
const searchButton = document.getElementById('search-button');
const foodInput = document.getElementById('food-input');
const resultsContainer = document.getElementById('results-container');
const resultsContent = document.getElementById('results-content');
const loader = document.querySelector('.loader');

// Add a 'click' event listener to the search button
searchButton.addEventListener('click', async () => {
    const query = foodInput.value.trim();
    if (query === "") {
        alert("Please enter a food to search for.");
        return;
    }

    // Show the loading state
    resultsContainer.classList.remove('hidden');
    loader.classList.remove('hidden');
    resultsContent.innerHTML = '';

    try {
        // --- THIS IS THE NEW PART: Calling our live AI function ---
        const response = await fetch('/.netlify/functions/getBbqTimes', {
            method: 'POST',
            body: JSON.stringify({ foodQuery: query })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // The AI sends back a string of JSON, so we need to parse it
        const data = JSON.parse(await response.text());
        
        // Hide the loader and render the real AI data
        loader.classList.add('hidden');
        renderResults(data);

    } catch (error) {
        console.error("Error fetching AI data:", error);
        loader.classList.add('hidden');
        resultsContent.innerHTML = `<p>Sorry, something went wrong. The grill master might be busy. Please try again.</p>`;
    }
});

// This function takes the AI data and builds the HTML to display it
function renderResults(data) {
    // Check if the AI returned a valid response
    if (!data || !data.food_name || !data.recommendations) {
        resultsContent.innerHTML = `<p>Sorry, I couldn't get a recommendation for that. Try being more specific, like "1-inch thick pork chop".</p>`;
        return;
    }

    let html = `<h2>${data.food_name}</h2>`;
    data.recommendations.forEach(rec => {
        html += `
            <div class="grill-type-card">
                <h3>${rec.grill_type}</h3>
                <p><strong>Temperature:</strong> ${rec.temperature}</p>
                <p><strong>Time:</strong> ${rec.time}</p>
                <p><strong>Notes:</strong> ${rec.notes}</p>
            </div>
        `;
    });
    resultsContent.innerHTML = html;
}


// --- PWA Service Worker Registration ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered! Scope: ', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed: ', err);
      });
  });
}