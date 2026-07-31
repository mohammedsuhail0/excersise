import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Disc, Zap, Flame, Radio, Volume2, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PlaylistOption {
  id: string;
  name: string;
  genre: 'phonk' | 'hardstyle' | 'synthwave' | 'lofi' | 'metal';
  artist: string;
  bpm: string;
  spotifyUri: string;
  coverImage: string;
  accentColor: string;
}

const SPOTIFY_PLAYLISTS: PlaylistOption[] = [
  {
    id: 'phonk-01',
    name: 'DRIFT PHONK PR',
    genre: 'phonk',
    artist: 'Kordhell, CORPSE, KSLV',
    bpm: '160 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWY64wDtewQt?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-orange-500 to-amber-500',
  },
  {
    id: 'hardstyle-01',
    name: 'HARDSTYLE BASS',
    genre: 'hardstyle',
    artist: 'Tevez, Sub Zero Project, Headhunterz',
    bpm: '150 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0pH238juFUe?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-red-500 to-orange-500',
  },
  {
    id: 'synthwave-01',
    name: 'CYBER SYNTHWAVE',
    genre: 'synthwave',
    artist: 'Carpenter Brut, Kavinsky, Synthwave',
    bpm: '125 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-purple-500 to-pink-500',
  },
  {
    id: 'metal-01',
    name: 'PRIMAL GYM RAGE',
    genre: 'metal',
    artist: 'Mick Gordon, Slipknot, Doom OST',
    bpm: '175 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXe632dDejWuD?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-amber-600 to-red-600',
  },
  {
    id: 'lofi-01',
    name: 'ZEN RECOVERY LOFI',
    genre: 'lofi',
    artist: 'ChilledCow, Lofi Girl, Zen',
    bpm: '85 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb2CM3R1r?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-emerald-500 to-teal-500',
  },
];

export const SpotifyAudioWidget: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistOption>(SPOTIFY_PLAYLISTS[0]);
  const [activeTab, setActiveTab] = useState<'spotify' | 'synthesizer'>('spotify');
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);

  // Web Audio Synth Beats Loop Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  const startWebAudioBeat = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      let step = 0;
      const bpm = parseInt(selectedPlaylist.bpm, 10) || 140;
      const intervalMs = (60 / bpm / 4) * 1000;

      setIsSynthPlaying(true);

      const playBeatStep = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;

        // Kick Drum on steps 0, 4, 8, 12
        if (step % 4 === 0) {
          const kickOsc = audioCtxRef.current.createOscillator();
          const kickGain = audioCtxRef.current.createGain();
          kickOsc.frequency.setValueAtTime(150, now);
          kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
          kickGain.gain.setValueAtTime(0.3, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          kickOsc.connect(kickGain);
          kickGain.connect(audioCtxRef.current.destination);
          kickOsc.start(now);
          kickOsc.stop(now + 0.15);
        }

        // Cowbell / Snare Hi-Hat on steps 2, 6, 10, 14
        if (step % 2 === 1) {
          const hatOsc = audioCtxRef.current.createOscillator();
          const hatGain = audioCtxRef.current.createGain();
          hatOsc.type = 'triangle';
          hatOsc.frequency.setValueAtTime(800, now);
          hatGain.gain.setValueAtTime(0.05, now);
          hatGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          hatOsc.connect(hatGain);
          hatGain.connect(audioCtxRef.current.destination);
          hatOsc.start(now);
          hatOsc.stop(now + 0.05);
        }

        step = (step + 1) % 16;
      };

      synthTimerRef.current = window.setInterval(playBeatStep, intervalMs);
    } catch {
      setIsSynthPlaying(false);
    }
  };

  const stopWebAudioBeat = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    setIsSynthPlaying(false);
  };

  useEffect(() => {
    return () => {
      stopWebAudioBeat();
    };
  }, []);

  const toggleSynthBeats = () => {
    soundEngine.playTick();
    if (isSynthPlaying) {
      stopWebAudioBeat();
    } else {
      startWebAudioBeat();
    }
  };

  return (
    <div className="flex flex-col h-full justify-between select-none animate-fade-up space-y-2.5">
      
      {/* HEADER WITH CATEGORY TOGGLES */}
      <div className="liquid-glass rounded-[24px] p-3 flex items-center justify-between border border-orange-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-[14px] font-extrabold text-white leading-tight">Tactile Spotify Deck</h3>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-[9.5px] text-orange-400 font-semibold uppercase tracking-wider">
              {selectedPlaylist.name} ({selectedPlaylist.bpm})
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              soundEngine.playTick();
              setActiveTab('spotify');
            }}
            className={`px-2.5 py-1 rounded-full text-[9.5px] font-extrabold uppercase transition-all ${
              activeTab === 'spotify' ? 'bg-orange-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Spotify
          </button>
          <button
            onClick={() => {
              soundEngine.playTick();
              setActiveTab('synthesizer');
            }}
            className={`px-2.5 py-1 rounded-full text-[9.5px] font-extrabold uppercase transition-all ${
              activeTab === 'synthesizer' ? 'bg-amber-500 text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Synth Beats
          </button>
        </div>
      </div>

      {/* VIEWPORT CONTENT */}
      {activeTab === 'spotify' ? (
        <div className="flex-1 flex flex-col space-y-2 overflow-hidden min-h-0">
          
          {/* PLAYLIST SELECTION HORIZONTAL STRIP */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 shrink-0">
            {SPOTIFY_PLAYLISTS.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  soundEngine.playTick();
                  setSelectedPlaylist(pl);
                }}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-extrabold shrink-0 flex items-center space-x-1.5 border transition-all ${
                  selectedPlaylist.id === pl.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-white/40 shadow-lg scale-105'
                    : 'liquid-glass text-white/70 border-white/10 hover:border-white/30'
                }`}
              >
                <Flame className="w-3 h-3 text-amber-300" />
                <span>{pl.name}</span>
              </button>
            ))}
          </div>

          {/* SPOTIFY EMBEDDED IFRAME PLAYER */}
          <div className="flex-1 rounded-[24px] overflow-hidden border border-white/15 shadow-2xl relative bg-black/60">
            <iframe
              title="Spotify Playlist Player"
              src={selectedPlaylist.spotifyUri}
              width="100%"
              height="100%"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="w-full h-full rounded-[24px] border-0"
            />
          </div>
        </div>
      ) : (
        /* SYNTHESIZER WEB AUDIO BEAT GENERATOR VIEW */
        <div className="flex-1 liquid-glass rounded-[24px] p-4 flex flex-col justify-between border border-amber-500/30 text-center space-y-3 relative overflow-hidden">
          
          {/* ANIMATED EQUALIZER VISUALIZER BARS */}
          <div className="flex items-end justify-center space-x-1.5 h-20 my-2">
            {[40, 75, 90, 50, 85, 100, 60, 95, 70, 45, 80, 60].map((h, i) => (
              <div
                key={i}
                className={`w-2.5 rounded-full bg-gradient-to-t ${selectedPlaylist.accentColor} transition-all duration-150 ${
                  isSynthPlaying ? 'animate-bounce' : 'opacity-40'
                }`}
                style={{
                  height: isSynthPlaying ? `${Math.max(20, Math.round(h * Math.random()))}%` : '20%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          <div>
            <h4 className="text-base font-black text-white">{selectedPlaylist.name} BEATS</h4>
            <p className="text-[11px] text-amber-400 font-semibold mt-0.5">
              Device Speaker Synth Beat Generator • {selectedPlaylist.bpm}
            </p>
          </div>

          {/* SYNTH BEAT CONTROLLER */}
          <button
            onClick={toggleSynthBeats}
            className={`w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all ${
              isSynthPlaying
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white animate-pulse'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-[1.02]'
            }`}
          >
            {isSynthPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Hardware Beat Generator</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white ml-0.5" />
                <span>Start Hardware Beat Generator ({selectedPlaylist.bpm})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* MINI FOOTER DOCK PLAYER */}
      <div className="liquid-glass rounded-[24px] p-3 flex items-center justify-between border border-white/10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
            <Disc className={`w-4 h-4 ${isSynthPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white leading-tight">{selectedPlaylist.name}</p>
            <p className="text-[9.5px] text-white/50">{selectedPlaylist.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-amber-400 border border-amber-500/30">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{selectedPlaylist.bpm}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
