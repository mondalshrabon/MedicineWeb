import { useState, useEffect, useRef } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Banner from '../Images/Banner.png';
import { useNavigate } from 'react-router-dom';

const Search = ({ Theme }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const DynamicSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      setSearchResults([]);
      setNotFound(false);
      return;
    }

    const medicinesRef = collection(db, 'categories');

    const nameQuery = query(
      medicinesRef,
      where('name_lowercase', '>=', term),
      where('name_lowercase', '<=', term + '\uf8ff')
    );

    const brandQuery = query(
      medicinesRef,
      where('medicine_brand_lowercase', '>=', term),
      where('medicine_brand_lowercase', '<=', term + '\uf8ff')
    );

    try {
      const [nameSnap, brandSnap] = await Promise.all([
        getDocs(nameQuery),
        getDocs(brandQuery)
      ]);

      const nameResults = nameSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const brandResults = brandSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const combinedResults = [...nameResults, ...brandResults];

      // Remove duplicates by id
      const uniqueResults = combinedResults.filter(
        (medicine, index, self) =>
          index === self.findIndex((m) => m.id === medicine.id)
      );

      setSearchResults(uniqueResults);
      setNotFound(uniqueResults.length === 0);
    } catch (error) {
      console.error("Error searching medicines:", error);
      setSearchResults([]);
      setNotFound(true);
    }
  };

  const handleVoiceSearch = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.toLowerCase();
      inputRef.current.value = spokenText;
      DynamicSearch({ target: { value: spokenText } });
    };
  };

  return (
    <>
      <div
        className={`flex h-screen flex-col items-center justify-center relative ${
          Theme ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        <img src={Banner} alt="google Logo" className="w-40 mb-5" />

        <div className="relative w-[90%] md:w-[600px]">
          <input
            ref={inputRef}
            type="text"
            onChange={DynamicSearch}
            placeholder="Search medicines..."
            className={`w-full px-4 py-2 rounded shadow ${
              Theme ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'
            }`}
          />
          {/* Mic Button */}
          <button
            onClick={handleVoiceSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            🎤
          </button>

          {/* Suggestions List */}
          {searchTerm && (
            <div
              className={`absolute top-full left-0 w-full z-10 mt-1 rounded shadow-lg ${
                Theme ? 'bg-gray-800 text-white' : 'bg-white text-black'
              }`}
            >
              {searchResults.length > 0 ? (
                <ul className="max-h-60 overflow-y-auto">
                  {searchResults.map((medicine) => (
                    <li
                      key={medicine.id}
                      className="p-3 hover:bg-blue-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/medicine/${medicine.id}`);
                        scrollTo(0, 0);
                      }}
                    >
                      {medicine.name} {medicine.Brand && `(${medicine.Brand})`}
                    </li>
                  ))}
                </ul>
              ) : (
                notFound && (
                  <div className="p-3 text-center opacity-60">Not Found</div>
                )
              )}
            </div>
          )}
        </div>

        {/* Buttons like Google */}
        <div className="mt-5 flex space-x-4">
          <div
            className={`px-3 py-1 rounded shadow ${
              Theme ? 'bg-gray-700' : 'bg-[#f8f9fa]'
            }`}
          >
            Medicine Search
          </div>
          <div
            className={`px-3 py-1 rounded shadow ${
              Theme ? 'bg-gray-700' : 'bg-[#f8f9fa]'
            }`}
          >
            I'm Feeling Lucky
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;