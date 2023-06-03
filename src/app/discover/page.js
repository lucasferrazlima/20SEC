"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import SongCard from '@/components/SongCard';


export default function Home() {
  const [topArtists, setTopArtists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  const [likedTracks, setLikedTracks] = useState([]);
  const [dislikedTracks, setDislikedTracks] = useState([]);
  const [knownTracks, setKnownTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('token');
      console.log(accessToken);
      if (!accessToken || accessToken === 'undefined') {
        // go to login page
        router.push('/login');
      } else {
        fetchTopArtists(accessToken);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (topArtists.length > 0) {
        const accessToken = localStorage.getItem('token');
        if (!accessToken || accessToken === 'undefined') {
          router.push('/login');
        } else {
          fetchRecommendedTracksByTopArtists(accessToken, topArtists);
        }
      }
    }}, [topArtists]);

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

    const data = await response.json()
      .then((data) => {
        const artistsId = data.items.map((artist) => artist.id);
        setTopArtists([...artistsId]);
      })
      .catch((error) => {
        router.push('/login');
      });

  }

  // function for fetching recommended tracks based on top 5 artists
  async function fetchRecommendedTracksByTopArtists(accessToken, artists) {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=100&seed_artists=${artists.join(',')}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    setRecommendedTracks([data.tracks]);
  }
      

  const handleLike = () => {
    setLikedTracks([...likedTracks, recommendedTracks[0][currentTrackIndex]]);
    setCurrentTrackIndex(currentTrackIndex + 1);
  }

  const handleDislike = () => {
    setDislikedTracks([...dislikedTracks, recommendedTracks[0][currentTrackIndex]]);
    setCurrentTrackIndex(currentTrackIndex + 1);
  }

  useEffect(() => {
    console.log('Liked Tracks:', likedTracks);
  }, [likedTracks]);

  useEffect(() => {
    console.log('Disliked Tracks:', dislikedTracks);
  }, [dislikedTracks]);

  return (
    <div className='content-center items-center'>
      {
        recommendedTracks.length > 0 && (
          <SongCard track={recommendedTracks[0][currentTrackIndex]} handleLike={handleLike} handleDislike={handleDislike} />
        )
      }
    </div>
  );
}
