import { Search } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import SearchResultsCard from './SearchResultsCard';

export default function SearchArtist({
  recommendationType,
  setRecommendationType,
  searchedArtist,
  setSearchedArtist,
  recommendedTracks,
  setRecommendedTracks,
}) {
  const [searchResults, setSearchResults] = useState([]);

  // fetch spotify API for searched artist
  useEffect(() => {
    if (searchedArtist.length > 0) {
      const accessToken = localStorage.getItem('token');
      if (!accessToken || accessToken === 'undefined') {
        router.push('/login');
      } else {
        const sanitizedArtist = DOMPurify.sanitize(searchedArtist);
        handleSearchArtist(accessToken, sanitizedArtist);
      }
    }
  }, [searchedArtist]);

  async function handleSearchArtist(accessToken, artist) {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(artist)}&type=artist&limit=5`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    setSearchResults(data.artists.items);
  }

  return (
    <div className="absolute flex flex-col text-xs justify-center items-center content-center mt-2">
      <input
        type="text"
        className="p-1  rounded-md w-60 sm:w-80 mx-auto text-tertiary pl-4 bg-gray-700 focus:outline-none "
        onChange={(e) => setSearchedArtist(e.target.value)}
        value={searchedArtist}
        placeholder="Search for an artist"
      />
      <ul className="w-11/12 bg-zinc-700 flex flex-col rounded-b-2xl">
        {
        searchedArtist.length > 0 ? searchResults.map((result) => (
          <li key={result.id} className=" ml-4">
            <SearchResultsCard
              result={result}
              recommendedTracks={recommendedTracks}
              setRecommendedTracks={setRecommendedTracks}
              searchedArtist={searchedArtist}
              setSearchedArtist={setSearchedArtist}
              recommendationType={recommendationType}
              setRecommendationType={setRecommendationType}
            />
          </li>
        )) : null
      }
      </ul>
    </div>
  );
}
