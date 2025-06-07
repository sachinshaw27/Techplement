import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the CSS file

function App() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [search, setSearch] = useState('');
  const [authors, setAuthors] = useState([]);
  const [newQuote, setNewQuote] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [fetching, setFetching] = useState(false); // State for fetching status

  useEffect(() => {
    fetchRandomQuote();
    fetchAuthors();
  }, []);

  const fetchRandomQuote = async () => {
    try {
      setFetching(true); // Start fetching
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/random-quote`);
      setQuote(response.data.quote);
      setAuthor(response.data.author);
      setFetching(false); // End fetching
    } catch (error) {
      console.error('Error fetching the quote', error);
      setFetching(false); // End fetching on error
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/authors`);
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors', error);
    }
  };

  const handleSearch = async () => {
    try {
      setFetching(true); // Start fetching
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/quotes?author=${search}`);
      if (response.data.length > 0) {
        setQuote(response.data[0].quote);
        setAuthor(response.data[0].author);
      } else {
        setQuote('No quotes found');
        setAuthor('');
      }
      setFetching(false); // End fetching
    } catch (error) {
      console.error('Error searching for quotes', error);
      setFetching(false); // End fetching on error
    }
  };

  const handleAddQuote = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/quotes`, {
        quote: newQuote,
        author: newAuthor,
      });
      console.log('Add quote response:', response.data);
      setNewQuote('');
      setNewAuthor('');
      fetchAuthors(); // Refresh the list of authors
      alert('Quote added successfully');
    } catch (error) {
      console.error('Error adding quote', error);
      alert('Failed to add quote');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Quote of the Day</h1>
        {fetching && <p>Loading...</p>}
        {!fetching && (
          <>
            <p>{quote}</p>
            <p><em>- {author}</em></p>
          </>
        )}
        <div className="search-container">
          <select value={search} onChange={(e) => setSearch(e.target.value)}>
            <option value="">Select an author</option>
            {authors.map((author, index) => (
              <option key={index} value={author}>{author}</option>
            ))}
          </select>
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className="add-quote-container">
          <h2>Add a New Quote</h2>
          <input
            type="text"
            value={newQuote}
            onChange={(e) => setNewQuote(e.target.value)}
            placeholder="Enter quote"
          />
          <input
            type="text"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
            placeholder="Enter author"
          />
          <button onClick={handleAddQuote}>Add Quote</button>
        </div>
      </header>
    </div>
  );
}

export default App;
