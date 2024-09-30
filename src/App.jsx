import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Bars } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faPaperPlane, faTrash, faClipboard, faHistory } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]); // State for message history
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [showHistory, setShowHistory] = useState(false); // State to control visibility of history
  const [suggestions, setSuggestions] = useState([]); // State for suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // State to control visibility of suggestions
  const answerRef = useRef(null);

  const dummySuggestions = [
    'What are the benefits of AI?',
    'How does machine learning work?',
    'Can you explain neural networks?',
    'What is deep learning?',
    'What is natural language processing?',
    'How can AI help in healthcare?',
    'What is reinforcement learning?',
    'How does AI affect society?',
    'Can you explain generative AI?',
  ];

  useEffect(() => {
    if (question.trim()) {
      const filteredSuggestions = dummySuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(question.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [question]);

  async function generateAnswer() {
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setError('');
    try {
      setLoading(true);
      setIsTyping(true);
      setAnswer('');

      setTimeout(() => {
        axios({
          url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC_mU22QDyEYKwlgXxEmSPCoSUCs37JR4M',// Use your actual API key here
          method: 'post',
          data: {
            contents: [{ parts: [{ text: question }] }],
          },
        })
          .then((response) => {
            const generatedText = response.data.candidates[0].content.parts[0].text;
            setAnswer(generatedText);
            setHistory([...history, { question, answer: generatedText }]);
            setIsTyping(false);
            answerRef.current.scrollIntoView({ behavior: 'smooth' });
          })
          .catch((error) => {
            handleError(error);
            setIsTyping(false);
          });
      }, 1000);
    } catch (error) {
      setIsTyping(false);
      handleError(error);
    } finally {
      setLoading(false);
    }
  }

  const handleError = (error) => {
    if (error.response) {
      setError('Error: ' + (error.response.data.message || 'Unable to generate an answer.'));
    } else if (error.request) {
      setError('Network error: Unable to connect to the server.');
    } else {
      setError('Error occurred while fetching the answer.');
    }
    console.error(error);
  };

  const clearInput = () => {
    setQuestion('');
    setAnswer('');
    setError('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
    alert('Answer copied to clipboard!');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      generateAnswer();
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const selectSuggestion = (suggestion) => {
    setQuestion(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className={`p-6 max-w-lg mx-auto ${darkMode ? 'dark:bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-md`}>
      <h1 className="text-4xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-300 dark:to-indigo-400 shadow-md">
        Startdust AI
      </h1>
      
 
      <button
        className="mb-4 px-4 py-2 text-sm font-semibold text-white rounded bg-blue-500 hover:bg-blue-600"
        onClick={toggleDarkMode}
        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
      </button>

      <textarea
        className={`border rounded w-full p-2 mb-4 h-32 ${darkMode ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100' : 'bg-gray-100 border-gray-300 text-black'}`}
        placeholder="Ask me anything"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Ask a question"
        rows={6}
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="flex justify-between mb-4">
        {/* Generate Answer Button */}
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300 mr-2"
          onClick={generateAnswer}
          disabled={loading}
          aria-live="polite"
          title="Generate Answer"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <Bars color="#fff" height={20} width={20} />
              <span className="ml-2">Loading...</span>
            </div>
          ) : (
            <FontAwesomeIcon icon={faPaperPlane} />
          )}
        </button>

        {/* Clear Input Button */}
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-300"
          onClick={clearInput}
          disabled={loading}
          title="Clear Input"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      {/* Copy to Clipboard Button */}
      <button
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition duration-300 mb-4"
        onClick={copyToClipboard}
        disabled={!answer}
        title="Copy Answer"
      >
        <FontAwesomeIcon icon={faClipboard} />
      </button>

      {showSuggestions && (
        <div className={`mb-4 border p-2 rounded shadow-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <p
                key={index}
                className={`cursor-pointer hover:bg-gray-200 p-1 ${darkMode ? 'text-gray-100 hover:bg-gray-600' : 'text-black'}`}
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </p>
            ))
          ) : (
            <p className={`${darkMode ? 'text-gray-100' : 'text-gray-500'}`}>No suggestions available.</p>
          )}
        </div>
      )}

      <div ref={answerRef} className={`mt-4 text-sm transition-opacity duration-300 ${isTyping ? 'opacity-100' : answer ? 'opacity-100' : 'opacity-0'}`}>
        {isTyping ? (
          <div className="flex items-center">
            <Bars color="#000" height={20} width={20} />
            <span className="ml-2">Thinking...</span>
          </div>
        ) : (
          <ReactMarkdown>{answer || 'Your answer will appear here...'}</ReactMarkdown>
        )}
      </div>

      {/* Show/Hide History Button */}
      <button
        className="mt-4 w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-lg transition duration-300"
        onClick={toggleHistory}
        title={showHistory ? 'Hide History' : 'Show History'}
      >
        <FontAwesomeIcon icon={faHistory} />
      </button>

      {/* Message History */}
      {showHistory && (
        <div className="border-t mt-2 pt-2">
          <h2 className="text-lg font-bold">Message History</h2>
          {history.length > 0 ? (
            history.map((item, index) => (
              <div key={index} className="mb-2">
                <p className="font-semibold">Q: {item.question}</p>
                <p className="text-gray-600">A: {item.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No previous messages.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
