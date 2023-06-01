"use client"

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [topArtists, setTopArtists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('token');
      console.log(accessToken);
      if (!accessToken) {
        console.log('No access token found');
      } else {
        fetchTopArtists(accessToken);
        fetchRecommendedTracksByTopArtists(accessToken);
      }
    }
  }, []);

  useEffect(() => {
    console.log('Updated Top Artists:', topArtists);
  }, [topArtists]);

  useEffect(() => {
    console.log('Updated Recommended Tracks:', recommendedTracks);  
  }, [recommendedTracks]);

  // function for fetching top 5 artists of user
  async function fetchTopArtists(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=5', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    const artistsId = data.items.map((artist) => artist.id);
    setTopArtists([...artistsId]);
  }

  // function for fetching recommended tracks based on top 5 artists
  async function fetchRecommendedTracksByTopArtists(accessToken) {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${topArtists.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    console.log(data.tracks);
    setRecommendedTracks([data]);
  }

  return (
    <div>
      <ul>
        Top Artists
        {topArtists.map((artist) => (
          <li key={artist}>{artist}</li>
        ))}
      </ul>
    </div>
  );
}
