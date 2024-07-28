// Array of quote objects
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock. Do what it does. Keep going.", category: "Motivation" },
    { text: "You miss 100% of the shots you don't take.", category: "Courage" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // Clear the current quote
    quoteDisplay.innerHTML = '';
  
    // Create and append quote text
    const quoteText = document.createElement('p');
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteDisplay.appendChild(quoteText);
  
    // Create and append quote category
    const quoteCategory = document.createElement('p');
    quoteCategory.textContent = `— ${randomQuote.category}`;
    quoteDisplay.appendChild(quoteCategory);
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
        alert('Quote added!');
        form.reset();
        showRandomQuote(); // Display a random quote after adding a new one
      } else {
        alert('Please fill in both fields.');
      }
    });
  }
  

// Event listeners for the buttons
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuote').addEventListener('click', createAddQuoteForm); // New listener for adding quotes

  
  // Initialize with a random quote
  showRandomQuote();
  