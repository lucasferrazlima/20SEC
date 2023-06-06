import { Search } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import SearchResultsCard from './SearchResultsCard';

export default function SearchArtist({ recommendationType, setRecommendationType, searchedArtist, setSearchedArtist, recommendedTracks, setRecommendedTracks }) {

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log('searched artist', searchedArtist);
  }, [searchedArtist]);
  
  //fetch spotify API for searched artist
  useEffect(() => {
      if (searchedArtist.length > 0) {
        const accessToken = localStorage.getItem('token');
        if (!accessToken || accessToken === 'undefined') {
          router.push('/login');
        } else {
          handleSearchArtist(accessToken);
        }
      }
  }, [searchedArtist]);

  async function handleSearchArtist(accessToken) {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${searchedArtist}&type=artist&limit=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      
    const data = await res.json();
    setSearchResults(data.artists.items);
  }

  return (
    <div className="flex flex-col">
      <input type="text" onChange={(e) => setSearchedArtist(e.target.value)} value={searchedArtist} placeholder="Search for an artist" />
      <ul>
      {
        searchedArtist.length > 0 ? searchResults.map((result) => {
          return (
            <li key={result.id}>
              <SearchResultsCard result={result} recommendedTracks={recommendedTracks} setRecommendedTracks={setRecommendedTracks} searchedArtist={searchedArtist} setSearchedArtist={setSearchedArtist} recommendationType={recommendationType} setRecommendationType={setRecommendationType} />
            </li>
          )
        }) : null
      }
      </ul>
    </div>
  )
}