import React, { useState } from 'react';
import { Music, Play, Pause, SkipForward, Radio, Disc } from 'lucide-react';

export const SpotifyAudioWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('Lofi Focus');

  const genres = [
    { name: 'Lofi Focus', artist: 'Zen Chillout', duration: '2:45', bpm: '85 BPM' },
    { name: 'Ambient Rain', artist: 'Calm Nature', duration: '4:10', bpm: '60 BPM' },
    { name: 'Cyber Phonk', artist: 'Energy Flow', duration: '3:15', bpm: '130 BPM' },
    { name: 'Heavy Metal', artist: 'Primal Power', duration: '3:50', bpm: '160 BPM' },
  ];

  const currentTrack = genres.find((g) => g.name === selectedGenre) || genres[0];

  return (
    <div className="flex flex-col h-full justify-between select-none animate-fade-up space-y-2.5">
      {/* Header */}
      <div className="liquid-glass rounded-[24px] p-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Radio className="w-5 h-5 text-orange-400" />
          <div>
            <h3 className="text-[15px] font-medium text-white">Focus Audio Deck</h3>
            <p className="text-[11px] text-white/60">Ambient soundscapes for training flow</p>
          </div>
        </div>
        <Disc className={`w-5 h-5 text-orange-400 ${isPlaying ? 'animate-spin' : ''}`} />
      </div>

      {/* Genre Pills Grid */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 my-1">
        {genres.map((g) => (
          <div
            key={g.name}
            onClick={() => {
              setSelectedGenre(g.name);
              setIsPlaying(true);
            }}
            className={`p-4 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between ${
              selectedGenre === g.name ? 'liquid-glass-selected' : 'liquid-glass'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50 font-mono">{g.bpm}</span>
              {selectedGenre === g.name && (
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              )}
            </div>

            <div>
              <p className="text-[14px] font-medium text-white">{g.name}</p>
              <p className="text-[11px] text-white/60 truncate">{g.artist}</p>
            </div>

            <span className="text-[10px] text-white/40">{g.duration}</span>
          </div>
        ))}
      </div>

      {/* Player Bar */}
      <div className="liquid-glass rounded-[24px] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[14px] font-medium text-white">{currentTrack.name}</p>
            <p className="text-[11px] text-white/60">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-gray-900" /> : <Play className="w-5 h-5 fill-gray-900 ml-0.5" />}
          </button>

          <button
            onClick={() => {
              const nextIdx = (genres.findIndex((g) => g.name === selectedGenre) + 1) % genres.length;
              setSelectedGenre(genres[nextIdx].name);
            }}
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-white/80"
          >
            <SkipForward className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
