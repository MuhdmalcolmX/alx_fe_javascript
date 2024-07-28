// Key for local storage
const LOCAL_STORAGE_KEY = 'dynamicQuoteGenerator.quotes';
const SESSION_STORAGE_KEY = 'dynamicQuoteGenerator.lastQuoteIndex';

// Function to load quotes from local storage
function loadQuotes() {
  const quotesJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
  return quotesJSON ? JSON.parse(quotesJSON) : [];
}

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quotes));
}

// Function to save the last viewed quote index to session storage
function saveLastQuoteIndex(index) {
  sessionStorage.setItem(SESSION_STORAGE_KEY, index);
}

// Load the last selected category from local storage
function loadLastSelectedCategory() {
    return localStorage.getItem(LAST_SELECTED_CATEGORY_KEY) || 'all';
}

// Save the last selected category to local storage
function saveLastSelectedCategory(category) {
    localStorage.setItem(LAST_SELECTED_CATEGORY_KEY, category);
}

// Populate the category filter dropdown
function populateCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))]; // Unique categories
    
    // Clear existing options (except "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    // Add categories to the dropdown
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Set the dropdown to the last selected category
    categoryFilter.value = loadLastSelectedCategory();
  }

// Filter and display quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    saveLastSelectedCategory(selectedCategory); // Persist selected category
  
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
      filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
    }
  
    if (filteredQuotes.length === 0) {
      displayMessage("No quotes available for this category.");
    } else {
      displayQuote(filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]);
    }
  }

// Display a specific quote
function displayQuote(quote) {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
      <p>"${quote.text}"</p>
      <p>— ${quote.category}</p>
    `;
  }

// Display a message in the quote display area
function displayMessage(message) {
    document.getElementById('quoteDisplay').innerHTML = `<p>${message}</p>`;
  }

//---------------------------------------

// // Function to load the last viewed quote index from session storage
// function loadLastQuoteIndex() {
//   const index = sessionStorage.getItem(SESSION_STORAGE_KEY);
//   return index ? parseInt(index, 10) : null;
// }

// // Initial quotes array (empty initially, will be loaded from local storage)
// let quotes = loadQuotes();

// // Function to display a random quote
// function showRandomQuote() {
//   const quoteDisplay = document.getElementById('quoteDisplay');
//   let randomIndex = Math.floor(Math.random() * quotes.length);
  
//   // If there are no quotes, show a placeholder message
//   if (quotes.length === 0) {
//     quoteDisplay.textContent = "No quotes available. Please add a new quote.";
//     return;
//   }

//   // Load last viewed quote index from session storage
//   const lastQuoteIndex = loadLastQuoteIndex();

//   // Ensure we don't show the same quote twice in a row
//   if (lastQuoteIndex !== null && quotes.length > 1) {
//     while (randomIndex === lastQuoteIndex) {
//       randomIndex = Math.floor(Math.random() * quotes.length);
//     }
//   }

//   const randomQuote = quotes[randomIndex];
  
//   // Clear the current quote
//   quoteDisplay.innerHTML = '';

//   // Create and append quote text
//   const quoteText = document.createElement('p');
//   quoteText.textContent = `"${randomQuote.text}"`;
//   quoteDisplay.appendChild(quoteText);

//   // Create and append quote category
//   const quoteCategory = document.createElement('p');
//   quoteCategory.textContent = `— ${randomQuote.category}`;
//   quoteDisplay.appendChild(quoteCategory);

//   // Save the last displayed quote index to session storage
//   saveLastQuoteIndex(randomIndex);
// }



//----------------------------------------------------------


// Function to export quotes to a JSON file
function exportToJsonFile() {
    const quotesJSON = JSON.stringify(quotes, null, 2);
    const blob = new Blob([quotesJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          alert('Quotes imported successfully!');
          showRandomQuote(); // Refresh displayed quote
        } else {
          alert('Invalid file format. Please upload a valid JSON file.');
        }
      } catch (error) {
        alert('Error parsing JSON file. Please ensure the file is correctly formatted.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }


// Function to show a new random quote (filtered by selected category)
function showRandomQuote() {
    filterQuotes();
  }
  
// Function to create and display the form to add a new quote
function createAddQuoteForm() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = ''; // Clear the current display
    
    // Create form elements
    const form = document.createElement('form');
    const quoteInput = document.createElement('input');
    const categoryInput = document.createElement('input');
    const submitButton = document.createElement('button');
  
    // Set attributes and placeholder text
    quoteInput.setAttribute('type', 'text');
    quoteInput.setAttribute('placeholder', 'Enter quote text');
    categoryInput.setAttribute('type', 'text');
    categoryInput.setAttribute('placeholder', 'Enter quote category');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Add Quote';
  
    // Append form elements
    form.appendChild(quoteInput);
    form.appendChild(categoryInput);
    form.appendChild(submitButton);
    quoteDisplay.appendChild(form);
  
    // Event listener for form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const newQuoteText = quoteInput.value.trim();
      const newQuoteCategory = categoryInput.value.trim();
  
      if (newQuoteText && newQuoteCategory) {
        const newQuote = {
          text: newQuoteText,
          category: newQuoteCategory
        };
        quotes.push(newQuote);
        saveQuotes(); // Save the updated quotes array to local storage
        alert('Quote added!');
        form.reset();
        showRandomQuote(); // Display a random quote after adding a new one
      } else {
        alert('Please fill in both fields.');
      }
    });
  }

// Initial setup
let quotes = loadQuotes();
populateCategory();
filterQuotes();


// Event listeners for the buttons
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', createAddQuoteForm);
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

// Initialize with a random quote
// if (quotes.length === 0) {
//   quotes = [
//     { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
//     { text: "Life is what happens when you're busy making other plans.", category: "Life" },
//     { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
//     { text: "You miss 100% of the shots you don't take.", category: "Courage" }
//   ];
//   saveQuotes(); // Save initial quotes to local storage
// }
// showRandomQuote();
