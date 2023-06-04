import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import PauseCircleFilledOutlinedIcon from '@mui/icons-material/PauseCircleFilledOutlined';

import Image from 'next/image';

import { useState } from 'react';

export default function SongCard({ track, handleLike, handleDislike, handlePlay }) {

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col mx-auto justify-center items-center object-center w-3/4 sm:max-w-sm h-screen">
      <img src={track.album.images[0].url} alt={track.name} className=' w-full sm:w-full'/>
      <div className="flex flex-col self-start">
        <h3>{track.name}</h3>
        <p className='text-quaternary'>
          {track.artists.map((artist) => artist.name).join(', ')}
          </p>
        <div className="flex justify-evenly">
          <button className='' onClick={() => handleDislike()}>
            {disliked ? <DeleteSweepIcon /> : <DeleteSweepOutlinedIcon />}
          </button>
          <button onClick={() => handlePlay()}>
            {playing ? <PauseCircleFilledOutlinedIcon /> : <PlayCircleFilledOutlinedIcon />}
          </button>
          <button onClick={() => handleLike()}>
            {liked ? <FavoriteIcon /> : <FavoriteBorderOutlinedIcon />}
          </button>
        </div>
      </div>
    </div>
  )
}