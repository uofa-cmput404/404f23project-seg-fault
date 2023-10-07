import logo from './logo.svg';
import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [authors, setAuthors] = useState([]); //  Initialize state for authors

  useEffect(() => {
    // Make a GET request to the API endpoint
    axios.get('http://127.0.0.1:8000/api/authors/')
      .then((response) => {
        // Set the authors state with the response data.
        setAuthors(response.data);
      })
      .catch((error) => {
        // Handle any errors
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Authors</h1>
        <ul>
          {authors.map((author) => (
            <li key={author.id}>{author.displayName}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;






// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
