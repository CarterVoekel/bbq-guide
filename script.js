// Get references to our HTML elements so we can work with them
const searchButton = document.getElementById('search-button');
const foodInput = document.getElementById('food-input');
const resultsContainer = document.getElementById('results-container');
const resultsContent = document.getElementById('results-content');
const loader = document.querySelector('.loader');

// Add a 'click' event listener to the search button
searchButton.addEventListener('click', () => {
    const query = foodInput.value.trim();
    if (query === "") {
        alert("Please enter a food to search for.");
        return;
    }

    // --- Show the loading state ---
    resultsContainer.classList.remove('hidden');
    loader.classList.remove('hidden');
    resultsContent.innerHTML = ''; // Clear any previous results

    // --- Simulate fetching data from our AI ---
    // We'll replace this with a real AI call later
    getMockData(query); 
});

// ** MOCK FUNCTION - Simulates a real AI response for testing the UI **
function getMockData(query) {
    console.log("Simulating AI search for:", query);
    
    // This is a fake delay to make the loading spinner visible
    setTimeout(() => { 
        // Hide the loader
        loader.classList.add('hidden');

        // Create a fake data object, just like a real AI would send back
        const mockData = {
            food_name: "1-inch Thick Ribeye Steak",
            recommendations: [
                {
                    grill_type: "Gas Grill",
                    temperature: "450-500°F (High)",
                    time: "4-6 minutes per side",
                    notes: "For medium-rare. Let it rest for 5-10 minutes before slicing."
                },
                {
                    grill_type: "Charcoal Grill",
                    temperature: "High heat (two-zone fire)",
                    time: "3-5 minutes per side",
                    notes: "Sear on the hot side, move to the cool side if flare-ups occur."
                },
                {
                    grill_type: "Pellet Grill (Smoker)",
                    temperature: "225°F then 500°F",
                    time: "45-60 min (smoke), 1 min per side (sear)",
                    notes: "Perfect for a 'reverse sear' method to add smoky flavor."
                }
            ]
        };
        
        // Send the fake data to our function that builds the HTML
        renderResults(mockData);

    }, 1500); // 1500 milliseconds = 1.5 seconds
}

// This function takes the data and builds the HTML to display it
function renderResults(data) {
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

// Check if the browser supports service workers
if ('serviceWorker' in navigator) {
    // Register our service worker file when the window loads
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