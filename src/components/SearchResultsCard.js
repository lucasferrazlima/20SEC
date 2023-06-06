import { Search } from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function SearchResultsCard({ searchResults, setSearchResults, result, recommendedTracks, setRecommendedTracks, searchedArtist, setSearchedArtist, recommendationType, setRecommendationType }) {

  const [selectedArtistId, setSelectedArtistId] = useState(null);

  // select smallest image for the src of the SearchResultsCard
  const smallestImage = result.images.reduce((smallest, image) => {
    if (image.height < smallest.height) {
      return image;
    }
    return smallest;
  });

  // fetch spotify API for recommended tracks based on searched artist
  useEffect(() => {
    if (selectedArtistId) {
      const accessToken = localStorage.getItem('token');
      if (!accessToken || accessToken === 'undefined') {
        router.push('/login');
      } else {
        fetchRecommendedTracksBySearchedArtist(accessToken);
      }
    }
  }, [selectedArtistId]);


  // function for fetching recommended tracks based on searched artist
  async function fetchRecommendedTracksBySearchedArtist(accessToken) {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${selectedArtistId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    setRecommendedTracks([data.tracks]);
  }

  const handleSearchResultsCardClick = async () => {
    await setSelectedArtistId(result.id);
    setSearchedArtist('');
  }   

  return (
    <button  onClick={() => handleSearchResultsCardClick()} className="flex bg-red-300">
      <div className='w-1/12 '>
        <img src={smallestImage.url} alt={result.name} className="object-contain" />
      </div>
      <p className=''>{result.name}</p>
    </button>
  )
}