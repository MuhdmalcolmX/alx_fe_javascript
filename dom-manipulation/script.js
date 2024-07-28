// Load quotes and categories from local storage or initialize with default data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" }
  ];
  let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
      filteredQuotes = quotes.filter(q => q.category === selectedCategory);
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `
      <p>${quote.text}</p>
      <p><em>Category: ${quote.category}</em></p>
    `;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }
  
  // Function to add a new quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value;
    const category = document.getElementById('newQuoteCategory').value;
  
    if (text && category) {
      quotes.push({ text, category });
      saveQuotes();
      populateCategories();
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      alert('Quote added successfully!');
    } else {
      alert('Please enter both a quote and a category.');
    }
  }
  
  // Function to populate categories in the dropdown menu
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(q => q.category))];
    
    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add new options
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
    
    // Set the selected category from local storage
    categoryFilter.value = selectedCategory;
  }
  
  // Function to filter quotes based on selected category
  function filterQuotes() {
    selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
  }
  
  // Function to export quotes to a JSON file
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
    const exportFileDefaultName = 'quotes.json';
  
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (e) {
        alert('Error parsing JSON file.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Load the last viewed quote if available
  window.onload = function() {
    populateCategories();
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      document.getElementById('quoteDisplay').innerHTML = `
        <p>${lastQuote.text}</p>
        <p><em>Category: ${lastQuote.category}</em></p>
      `;
    }
  };
  

// -----------------------------------------------------------------

// Define the server URL (JSONPlaceholder endpoint for posts, simulating quotes)
//let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
const serverUrl = 'https://jsonplaceholder.typicode.com/posts';

// Fetch quotes from the server and handle conflicts
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    const formattedServerQuotes = serverQuotes.map(quote => ({
      id: quote.id,
      text: quote.title,
      category: quote.body
    }));

    let conflictsDetected = false;

    formattedServerQuotes.forEach(serverQuote => {
      const localIndex = quotes.findIndex(q => q.id === serverQuote.id);

      if (localIndex !== -1) {
        if (JSON.stringify(quotes[localIndex]) !== JSON.stringify(serverQuote)) {
          conflictsDetected = true;
          displayConflictResolution(quotes[localIndex], serverQuote);
        }
      } else {
        quotes.push(serverQuote);
      }
    });

    if (!conflictsDetected) {
      localStorage.setItem('quotes', JSON.stringify(quotes));
      displayNotification('Quotes synced with server.');
    }
  } catch (error) {
    displayNotification('Error syncing with server.');
  }
}

// Display notification messages
function displayNotification(message) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.style.display = 'block';
  setTimeout(() => { notification.style.display = 'none'; }, 5000);
}

// Show conflict resolution options
function displayConflictResolution(localQuote, serverQuote) {
  const conflictResolution = document.getElementById('conflictResolution');
  document.getElementById('localQuote').innerText = `${localQuote.text} (Category: ${localQuote.category})`;
  document.getElementById('serverQuote').innerText = `${serverQuote.text} (Category: ${serverQuote.category})`;

  conflictResolution.style.display = 'block';
  conflictResolution.dataset.localId = localQuote.id;
  conflictResolution.dataset.serverQuote = JSON.stringify(serverQuote);
}

// Handle user's choice in conflict resolution
function resolveConflict(choice) {
  const conflictResolution = document.getElementById('conflictResolution');
  const localId = conflictResolution.dataset.localId;
  const serverQuote = JSON.parse(conflictResolution.dataset.serverQuote);
  const index = quotes.findIndex(q => q.id === parseInt(localId));

  if (choice === 'local') {
    // Keep local data, do nothing
  } else {
    quotes[index] = serverQuote;
  }

  localStorage.setItem('quotes', JSON.stringify(quotes));
  conflictResolution.style.display = 'none';
  displayNotification('Conflict resolved.');
}

// Add a new quote and sync with the server
async function addQuote() {
  const text = document.getElementById('newQuoteText').value;
  const category = document.getElementById('newQuoteCategory').value;

  if (text && category) {
    const newQuote = { id: Date.now(), text, category };
    quotes.push(newQuote);
    saveQuotes();

    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newQuote.text, body: newQuote.category })
      });
      const data = await response.json();
      displayNotification('Quote synced with server.');
    } catch (error) {
      displayNotification('Error syncing quote with server.');
    }

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Periodically sync data with the server
setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds

// Initial setup
window.onload = function() {
  fetchQuotesFromServer(); // Initial sync with server
};

// Function to display a random quote (assuming a function already exists)
function showRandomQuote() {
  if (quotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = `
      <p>${quote.text}</p>
      <p><em>Category: ${quote.category}</em></p>
    `;
  }
}
