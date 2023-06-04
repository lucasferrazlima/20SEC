"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { Helmet } from 'react-helmet';

import SongCard from '@/components/SongCard';


export default function DiscoverPage() {

  const [topArtists, setTopArtists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  const [likedTracks, setLikedTracks] = useState([]);
  const [dislikedTracks, setDislikedTracks] = useState([]);
  const [knownTracks, setKnownTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [player, setPlayer] = useState(undefined);
  const [deviceList, setDeviceList] = useState([]);

  const router = useRouter();

  const getDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(data => {
        const devices = data.devices;
        console.log('devices:', devices);
      })
      .catch((error) => {
        console.log(error);
      });
    }



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
    if (typeof window !== 'undefined') {
      if (recommendedTracks.length > 0) {
        const accessToken = localStorage.getItem('token');
        if (!accessToken || accessToken === 'undefined') {
          router.push('/login');
        } else {
          getDevices();
        }
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

  const handlePlay = async() => {
    () => setPlaying(!playing)
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
      body: JSON.stringify({
        uris: [recommendedTracks[0][currentTrackIndex].uri],
        position_ms: 0
      }),
    });

    const data = await res.json();
    console.log(data);  
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log('Liked Tracks:', likedTracks);
  }, [likedTracks]);

  useEffect(() => {
    console.log('Disliked Tracks:', dislikedTracks);
  }, [dislikedTracks]);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'New Music Discoverer',
        getOAuthToken: async (callback) => {
          const accessToken = localStorage.getItem('token');
          callback(accessToken);
        },
        volume: 0.5
      });
  
      setPlayer(player);

      // Listen to events
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
  
      player.addListener('player_state_changed', (state) => {
        console.log('Player State Changed', state);
      });
  
      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      // Connect to the player
      player.connect();

    };
  }, []);
  

  return (
    <div className='content-center items-center'>
      <Helmet>
        <script src="https://sdk.scdn.co/spotify-player.js" defer></script>
      </Helmet>
      {
        recommendedTracks.length > 0 && (
          <SongCard track={recommendedTracks[0][currentTrackIndex]} handleLike={handleLike} handleDislike={handleDislike} handlePlay={handlePlay}/>
        )
      }
    </div>
  );
}
