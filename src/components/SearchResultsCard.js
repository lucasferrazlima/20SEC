import { useState, useEffect } from 'react';

export default function SearchResultsCard({
  result,
  setRecommendedTracks,
  setSearchedArtist,
}) {
  const [selectedArtistId, setSelectedArtistId] = useState(null);

  // select smallest image for the src of the SearchResultsCard
  const smallestImage = result.images.length > 0
    ? result.images.reduce((smallest, image) => {
      if (image.height < smallest.height) {
        return image;
      }
      return smallest;
    })
    : null;

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
      },
    );

    const data = await response.json();
    setRecommendedTracks([data.tracks]);
  }

  const handleSearchResultsCardClick = async () => {
    await setSelectedArtistId(result.id);
    setSearchedArtist('');
  };

  return (
    <button type="button" onClick={() => handleSearchResultsCardClick()} className="flex my-2 w-full hover:opacity-70">
      <div className=" w-14 h-14 sm:w-20 sm:h-20">
        {smallestImage && (
        <img src={smallestImage.url} alt={result.name} className="rounded-full w-full h-full" />
        )}
      </div>
      <p className="self-center ml-4 font-semibold">{result.name}</p>
    </button>
  );
}
