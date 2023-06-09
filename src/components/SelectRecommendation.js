'use client';

import SearchArtist from '@/components/SearchArtist';

export default function SelectRecommendation({
  recommendationType,
  setRecommendationType,
  searchedArtist,
  setSearchedArtist,
  recommendedTracks,
  setRecommendedTracks,
}) {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="flex gap-10 sm:gap-20">
        <button
          type="button"
          onClick={() => setRecommendationType('top artists')}
          className={
            recommendationType === 'top artists'
              ? 'text-xs text-primary font-semibold'
              : 'text-quaternary text-xs font-semibold'
          }
        >
          Your Top Artists
        </button>
        <button
          type="button"
          onClick={() => setRecommendationType('searched artist')}
          className={
            recommendationType === 'searched artist'
              ? 'text-primary text-xs font-semibold'
              : 'text-quaternary text-xs font-semibold'
          }
        >
          Search Artist
        </button>
      </div>
      <div className="flex flex-col content-center mx-auto items-center">
        {
        recommendationType === 'searched artist'
          ? (
            <SearchArtist
              searchedArtist={searchedArtist}
              setSearchedArtist={setSearchedArtist}
              recommendedTracks={recommendedTracks}
              setRecommendedTracks={setRecommendedTracks}
              recommendationType={recommendationType}
              setRecommendationType={setRecommendationType}
            />
          ) : null
}
      </div>
    </div>
  );
}
