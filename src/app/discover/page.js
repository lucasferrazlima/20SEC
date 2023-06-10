'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Helmet } from 'react-helmet';

import '@fontsource/bebas-neue';
import SongCard from '@/components/SongCard';
import SelectRecommendation from '@/components/SelectRecommendation';

export default function DiscoverPage() {
  const [topArtists, setTopArtists] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  const [likedTracks, setLikedTracks] = useState([]);
  const [dislikedTracks, setDislikedTracks] = useState([]);
  const [knownTracks, setKnownTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [player, setPlayer] = useState(undefined);
  const [deviceList, setDeviceList] = useState([]);
  const [recommendationType, setRecommendationType] = useState('top artists');
  const [searchedArtist, setSearchedArtist] = useState('');
  const [topArtistsFetched, setTopArtistsFetched] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('token');
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
        } else if (recommendationType === 'top artists') {
          fetchRecommendedTracksByTopArtists(accessToken, topArtists);
        }
      }
    }
  }, [topArtists, recommendationType]);

  // web playback SDK setup
  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'New Music Discoverer',
        getOAuthToken: async (callback) => {
          const accessToken = localStorage.getItem('token');
          callback(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);
      player.activateElement();

      // Listen to events
      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        getDevices();
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      getDevices();
    }
  }, []);

  const handleLike = () => {
    setLikedTracks([...likedTracks, recommendedTracks[0][currentTrackIndex]]);
    setCurrentTrackIndex(currentTrackIndex + 1);
  };

  const handleDislike = () => {
    setDislikedTracks([...dislikedTracks, recommendedTracks[0][currentTrackIndex]]);
    setCurrentTrackIndex(currentTrackIndex + 1);
  };

  // If user likes 15 tracks, automatically redirect to export page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (likedTracks.length === 15) {
        handleExport();
      }
    }
  }, [likedTracks]);

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
      },
    );

    const data = await response.json();
    setRecommendedTracks([data.tracks]);
  }

  let stopTimeout;

  // function for playing track using web playback SDK
  const handlePlay = async () => {
    try {
      const deviceName = 'New Music Discoverer';
      const device = deviceList.find((device) => device.name === deviceName);

      if (!device) {
        console.log('Device not found');
        return;
      }

      const device_id = device.id;

      const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          uris: [recommendedTracks[0][currentTrackIndex].uri],
          position_ms: 20000,
        }),
      });

      const data = await res.json();
    } catch (error) {
      console.log(error);
    }

    if (stopTimeout) {
      clearTimeout(stopTimeout);
    }

    // stop track after 20 seconds
    stopTimeout = setTimeout(() => {
      handleStop();
    }, 21500);
  };

  // function for stopping track using web playback SDK
  const handleStop = async () => {
    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  // function for getting list of devices tied to user account
  const getDevices = async () => {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDeviceList(data.devices);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleExport = () => {
    const likedTracksString = JSON.stringify(likedTracks);
    localStorage.setItem('likedTracks', likedTracksString);
    router.push('/export');
  };

  return (
    <div className="flex flex-col content-center items-center justify-center min-h-screen">
      <Helmet>
        <script src="https://sdk.scdn.co/spotify-player.js" defer />
      </Helmet>
      <div className="flex flex-row gap-3 items-center pb-20 md:pb-0 md:absolute md:self-start md:justify-start md:top-10 md:left-5 sm:pb-4">
        <h1 className="text-4xl text-primary font-bebas md:text-5xl">20SEC</h1>
        <span className="text-sm font-bebas text-quaternary">for</span>
        <img src="/spotify.svg" alt="spotify logo" className="w-8 h-8" />
      </div>
      <SelectRecommendation
        recommendationType={recommendationType}
        setRecommendationType={setRecommendationType}
        searchedArtist={searchedArtist}
        setSearchedArtist={setSearchedArtist}
        recommendedTracks={recommendedTracks}
        setRecommendedTracks={setRecommendedTracks}
      />
      {
        recommendedTracks.length > 0 && (
          <SongCard
            track={recommendedTracks[0][currentTrackIndex]}
            handleLike={handleLike}
            handleDislike={handleDislike}
            handlePlay={handlePlay}
            handleExport={handleExport}
          />
        )
      }
    </div>
  );
}
