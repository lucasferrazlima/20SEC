import Link from 'next/link';

export default function Home() {

  return (
    <div>
      <Link href="/login">
      <button >Login to Spotify</button>
      </Link>
    </div>
  );
}

