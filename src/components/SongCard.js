import FavoriteIcon from '@mui/icons-material/Favorite';
import ReplyIcon from '@mui/icons-material/Reply';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useState } from 'react';
import HoverMessage from './HoverMessage';

export default function SongCard({
  track, handleLike, handleDislike, handlePlay, handleExport,
}) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  return (
    <div className="flex flex-col mx-auto justify-center items-center object-center w-3/4 sm:max-w-sm ">
      <img
        src={track.album.images[0].url}
        alt={track.name}
        className=" w-full sm:w-full "
      />
      <div className="flex flex-col self-start mt-2 w-11/12">
        <h3 className="text-sm truncate">{track.name}</h3>
        <p className="text-quaternary text-sm truncate">
          {track.artists.map((artist) => artist.name).join(', ')}
        </p>
      </div>
      <div className="mt-2 flex items-center justify-around w-full">
        <button
          type="button"
          className=""
          onClick={() => handleDislike()}
          onMouseOver={() => setDisliked(true)}
          onFocus={() => setDisliked(true)}
          onMouseOut={() => setDisliked(false)}
          onBlur={() => setDisliked(false)}
        >
          {
              disliked
                ? <ReplyIcon style={{ color: '#1db954', fontSize: '2rem' }} />
                : (
                  <ReplyIcon
                    style={{ color: '#b3b3b3', fontSize: '2rem' }}
                  />
                )
            }
        </button>
        <button
          type="button"
          className=""
          onClick={() => handlePlay()}
        >
          {
              playing
                ? (
                  <PauseIcon
                    style={{ color: '#b3b3b3', fontSize: '3rem' }}
                    sx={{ '& :hover': { color: '#1db954' } }}
                  />
                )
                : (
                  <PlayArrowIcon
                    style={{ color: '#b3b3b3', fontSize: '3rem' }}
                    sx={{ '& :hover': { color: '#1db954' } }}
                  />
                )
            }
        </button>
        <button
          type="button"
          className=""
          onClick={() => handleLike()}
          onMouseOver={() => setLiked(true)}
          onFocus={() => setLiked(true)}
          onMouseOut={() => setLiked(false)}
          onBlur={() => setLiked(false)}
        >
          {
              liked
                ? <FavoriteIcon style={{ color: '#1db954', fontSize: '2rem' }} />
                : <FavoriteIcon style={{ color: '#b3b3b3', fontSize: '2rem' }} />
            }
        </button>
      </div>
      <div className="flex items-center font-thin justify-between w-full px-2 mt-10 sm:mt-5">
        <button
          type="button"
          className="text-quaternary text-xs cursor-default z-20"
          onMouseEnter={() => setShowMessage(true)}
          onTouchStart={() => setShowMessage(true)}
          onMouseLeave={() => setShowMessage(false)}
          onTouchEnd={() => setShowMessage(false)}
          onFocus={() => setShowMessage(true)}
          onBlur={() => setShowMessage(false)}
        >
          Music Not Playing?
        </button>
        {showMessage && <HoverMessage />}
        <button
          type="button"
          className="text-quaternary text-xs bg-quaternary bg-opacity-25 p-2   rounded-sm hover:bg-opacity-40 "
          onClick={() => handleExport()}
        >
          Export Likes
        </button>
      </div>
    </div>
  );
}
