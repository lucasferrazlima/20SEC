"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ExportPage() {

  const router = useRouter();

  const [likedTracks, setLikedTracks] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        
      const likedTracksInLocalStorage = localStorage.getItem('likedTracks');
      if (likedTracksInLocalStorage) {
        const parsedLikedTracks = JSON.parse(likedTracksInLocalStorage);
        console.log(parsedLikedTracks);
        setLikedTracks(parsedLikedTracks);
        localStorage.removeItem('likedTracks');
        console.log(likedTracks);
      } else {
        router.push('/discover');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (likedTracks.length > 0) {
        console.log(likedTracks);
      }
    }
    }, [likedTracks]);

  return (
    <div>
      <h1>Export</h1>
    </div>
  );
}
