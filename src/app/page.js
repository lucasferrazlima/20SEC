'use client';

import Link from 'next/link';

import '@fontsource/bebas-neue';
import '@fontsource/montserrat';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md px-6 py-12 bg-secondary shadow-lg h-screen sm:rounded-lg sm:h-auto">
        <div className="flex items-center justify-center mb-8 gap-3 border-b-2 pb-6 border-gray-100">
          <h1 className="text-4xl text-primary font-bebas md:text-5xl">20SEC</h1>
          <span className="text-sm font-bebas text-tertiary">for</span>
          <img src="/spotify.svg" alt="Spotify logo" className="w-8 h-8" />
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-tertiary mb-4 font-montserrat text-center">Discover New Music</h2>
          <ul className="list-disc pl-6 text-md text-quaternary font-montserrat">
            <li>Login to your Spotify account.</li>
            <li>Choose to get recommendations based on your top artists or search for any artist.</li>
            <li>Listen to 20 seconds of each track.</li>
            <li>
              Use
              {' '}
              <ReplyIcon style={{ color: '#1db954' }} />
              {' '}
              for tracks you don't like or already know.
            </li>
            <li>
              Use
              {' '}
              <FavoriteIcon style={{ color: '#1db954' }} />
              {' '}
              for tracks you like and wish to give a chance.
            </li>
            <li>Export a maximum of 15 liked songs to a Spotify playlist and enjoy them anytime.</li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Link href="/login">
            <button type="button" className="bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
              Login with Spotify
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
