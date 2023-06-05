import { useRouter } from 'next/router';

router = useRouter();

// function for fetching top 5 artists of user
export async function fetchTopArtists(accessToken) {
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
export async function fetchRecommendedTracksByTopArtists(accessToken, artists) {
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

let stopTimeout;

// function for playing track using web playback SDK
export async function handlePlay() {

  try {
    const deviceName = 'New Music Discoverer';
    const device = deviceList.find(device => device.name === deviceName);

    if (!device) {
      console.log('Device not found');
      return;
    }

    const device_id = device.id;

    const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        uris: [recommendedTracks[0][currentTrackIndex].uri],
        position_ms: 20000,
      }),
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }

  if (stopTimeout) {
    clearTimeout(stopTimeout);
  }

  // stop track after 20 seconds
  stopTimeout = setTimeout(() => {
    console.log('Stopping track')
    handleStop();
  }, 21500);
};

// function for stopping track using web playback SDK
export async function handleStop() {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

// function for getting list of devices tied to user account
export async function getDevices() {
  const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then((res) => res.json())
    .then(data => {
      setDeviceList(data.devices);
    })
    .catch((error) => {
      console.log(error);
    });
 }
