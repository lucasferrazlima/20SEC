"use client"

import { useState } from 'react';
import SearchArtist from '@/components/SearchArtist';

export default function SelectRecommendation({ recommendationType,setRecommendationType, searchedArtist, setSearchedArtist, recommendedTracks, setRecommendedTracks}) {

  return (
    <div className="flex flex-col">
      <p>Hello, {localStorage.getItem('userId')}</p>
      <p>Recommendation based on:</p>
      <div className="flex">
        <button onClick={() => setRecommendationType('top artists')} className="bg-primary rounded-md text-white">Your Top Artists</button>
        <button onClick={() => setRecommendationType('searched artist')} className="bg-primary rounded-md text-white">Searched Artist</button>
      </div>
      <div>
        {recommendationType === 'searched artist' ? <SearchArtist searchedArtist={searchedArtist} setSearchedArtist={setSearchedArtist} recommendadedTracks={recommendedTracks} setRecommendedTracks={setRecommendedTracks} recommendationType={recommendationType} setRecommendationType={setRecommendationType} /> : null
        }
      </div>
    </div>
  )
}