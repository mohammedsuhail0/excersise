import React, { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Disc, Zap, Flame, Radio, Volume2, Sparkles, LogIn, CheckCircle2, User, HeartHandshake, Smile } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PlaylistOption {
  id: string;
  name: string;
  category: 'energy' | 'relax';
  genre: string;
  artist: string;
  bpm: string;
  spotifyUri: string;
  coverImage: string;
  accentColor: string;
}

const DEFAULT_SPOTIFY_CLIENT_ID = '6abb2966d85641b2bf05478031676c46';

const CURATED_PLAYLISTS: PlaylistOption[] = [
  {
    id: 'phonk-01',
    name: 'DRIFT PHONK',
    category: 'energy',
    genre: 'Phonk',
    artist: 'Kordhell, KSLV, DVRST',
    bpm: '160 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWY64wDtewQt?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-orange-500 to-amber-500',
  },
  {
    id: 'beastmode-01',
    name: 'BEAST MODE GYM',
    category: 'energy',
    genre: 'Workout Hype',
    artist: 'Travis Scott, Drake, Eminem',
    bpm: '140 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX35oM5SpBvwu?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-amber-500 to-red-500',
  },
  {
    id: 'hardstyle-01',
    name: 'HARDSTYLE WORKOUT',
    category: 'energy',
    genre: 'Hardstyle',
    artist: 'Sub Zero Project, Tevez, Headhunterz',
    bpm: '150 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX0pH238juFUe?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-red-500 to-orange-500',
  },
  {
    id: 'rock-01',
    name: 'ROCK HARD DRIVE',
    category: 'energy',
    genre: 'Heavy Metal & Rock',
    artist: 'Doom OST, Slipknot, Rammstein',
    bpm: '170 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXe632dDejWuD?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-amber-600 to-red-600',
  },
  {
    id: 'lofi-01',
    name: 'LOFI CHILL BEATS',
    category: 'relax',
    genre: 'Lofi & Ambient',
    artist: 'Lofi Girl, Chillhop Music',
    bpm: '85 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Ueb2CM3R1r?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'piano-01',
    name: 'PEACEFUL PIANO ZEN',
    category: 'relax',
    genre: 'Deep Relaxation',
    artist: 'Yiruma, Ludovico Einaudi',
    bpm: '60 BPM',
    spotifyUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    coverImage: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80',
    accentColor: 'from-blue-500 to-cyan-500',
  },
];

// PKCE helper functions for Spotify OAuth
function generateRandomString(length: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const SpotifyAudioWidget: React.FC = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistOption>(CURATED_PLAYLISTS[0]);
  const [moodFilter, setMoodFilter] = useState<'all' | 'energy' | 'relax'>('all');
  const [activeTab, setActiveTab] = useState<'spotify' | 'synthesizer'>('spotify');
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);

  // Spotify OAuth Account State
  const [spotifyToken, setSpotifyToken] = useState<string | null>(() => {
    return localStorage.getItem('spotify_access_token');
  });
  const [spotifyProfile, setSpotifyProfile] = useState<{ displayName: string; imageUrl?: string } | null>(() => {
    return localStorage.getItem('spotify_access_token') ? { displayName: 'Spotify Athlete' } : null;
  });
  const [userPlaylists, setUserPlaylists] = useState<PlaylistOption[]>([]);

  // Web Audio Synth Beats Loop Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Check URL query parameters for PKCE authorization code redirect ?code=...
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      const codeVerifier = localStorage.getItem('spotify_code_verifier');
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || DEFAULT_SPOTIFY_CLIENT_ID;
      const redirectUri = window.location.origin + window.location.pathname;

      if (codeVerifier) {
        fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.access_token) {
              setSpotifyToken(data.access_token);
              setSpotifyProfile({ displayName: 'Spotify Athlete' });
              localStorage.setItem('spotify_access_token', data.access_token);
              localStorage.removeItem('spotify_code_verifier');
              window.history.replaceState(null, '', window.location.pathname);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  // Fetch user profile & personal playlists when token exists
  useEffect(() => {
    if (!spotifyToken) return;

    // 1. Fetch User Profile
    fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${spotifyToken}` },
    })
      .then((res) => {
        if (res.status === 401) {
          setSpotifyToken(null);
          setSpotifyProfile(null);
          localStorage.removeItem('spotify_access_token');
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (data) {
          setSpotifyProfile({
            displayName: data.display_name || 'Spotify Athlete',
            imageUrl: data.images?.[0]?.url,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch User Personal Playlists
    fetch('https://api.spotify.com/v1/me/playlists?limit=8', {
      headers: { Authorization: `Bearer ${spotifyToken}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.items) {
          const formatted: PlaylistOption[] = data.items.map((item: any, idx: number) => ({
            id: `user-pl-${item.id || idx}`,
            name: item.name?.toUpperCase() || 'MY PLAYLIST',
            category: 'energy',
            genre: 'personal',
            artist: `By ${item.owner?.display_name || 'You'}`,
            bpm: 'PERSONAL',
            spotifyUri: `https://open.spotify.com/embed/playlist/${item.id}?utm_source=generator&theme=0`,
            coverImage: item.images?.[0]?.url || CURATED_PLAYLISTS[0].coverImage,
            accentColor: 'from-orange-500 to-amber-500',
          }));
          setUserPlaylists(formatted);
        }
      })
      .catch(() => {});
  }, [spotifyToken]);

  const handleConnectSpotify = async () => {
    soundEngine.playTick();
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || DEFAULT_SPOTIFY_CLIENT_ID;
    const redirectUri = window.location.origin + window.location.pathname;

    const verifier = generateRandomString(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem('spotify_code_verifier', verifier);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      scope: 'user-read-private user-read-email playlist-read-private',
      code_challenge_method: 'S256',
      code_challenge: challenge,
      show_dialog: 'true',
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleDisconnectSpotify = () => {
    soundEngine.playTick();
    setSpotifyToken(null);
    setSpotifyProfile(null);
    setUserPlaylists([]);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_code_verifier');
  };

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

  const filteredCurated = CURATED_PLAYLISTS.filter((pl) => {
    if (moodFilter === 'all') return true;
    return pl.category === moodFilter;
  });

  const allAvailablePlaylists = [...userPlaylists, ...filteredCurated];

  return (
    <div className="flex flex-col h-full justify-between select-none animate-fade-up space-y-2">
      
      {/* HEADER WITH SPOTIFY CONNECT & CATEGORY TOGGLES */}
      <div className="liquid-glass rounded-[24px] p-3 flex items-center justify-between border border-orange-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-green-500 flex items-center justify-center text-white shadow-md">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="text-[14px] font-extrabold text-white leading-tight">Tactile Spotify Deck</h3>
              <Sparkles className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-[9.5px] text-emerald-400 font-semibold uppercase tracking-wider">
              {spotifyProfile ? `Connected: ${spotifyProfile.displayName}` : 'Official Spotify Connect'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {spotifyToken ? (
            <button
              onClick={handleDisconnectSpotify}
              className="px-2.5 py-1 rounded-full text-[9.5px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1 hover:bg-emerald-500/30 transition-all"
              title="Disconnect Spotify Account"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Connected</span>
            </button>
          ) : (
            <button
              onClick={handleConnectSpotify}
              className="px-2.5 py-1 rounded-full text-[9.5px] font-extrabold bg-emerald-500 text-white shadow-md flex items-center space-x-1 hover:scale-105 active:scale-95 transition-all"
            >
              <LogIn className="w-3 h-3" />
              <span>Connect Spotify</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playTick();
              setActiveTab(activeTab === 'spotify' ? 'synthesizer' : 'spotify');
            }}
            className="px-2 py-1 rounded-full text-[9.5px] font-extrabold uppercase liquid-glass text-white/80 hover:text-white transition-all ml-1"
          >
            {activeTab === 'spotify' ? 'Synth Beats' : 'Spotify'}
          </button>
        </div>
      </div>

      {/* VIEWPORT CONTENT */}
      {activeTab === 'spotify' ? (
        <div className="flex-1 flex flex-col space-y-2 overflow-hidden min-h-0">
          
          {/* MOOD & ENERGY CATEGORY SELECTOR STRIP */}
          <div className="flex items-center space-x-1.5 shrink-0 justify-between">
            <button
              onClick={() => {
                soundEngine.playTick();
                setMoodFilter('all');
              }}
              className={`flex-1 py-1 rounded-full text-[9.5px] font-extrabold uppercase transition-all ${
                moodFilter === 'all'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                  : 'liquid-glass text-white/60 hover:text-white'
              }`}
            >
              🔥 All Vibes ({CURATED_PLAYLISTS.length})
            </button>

            <button
              onClick={() => {
                soundEngine.playTick();
                setMoodFilter('energy');
              }}
              className={`flex-1 py-1 rounded-full text-[9.5px] font-extrabold uppercase transition-all ${
                moodFilter === 'energy'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                  : 'liquid-glass text-white/60 hover:text-white'
              }`}
            >
              ⚡ High Energy (4)
            </button>

            <button
              onClick={() => {
                soundEngine.playTick();
                setMoodFilter('relax');
              }}
              className={`flex-1 py-1 rounded-full text-[9.5px] font-extrabold uppercase transition-all ${
                moodFilter === 'relax'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                  : 'liquid-glass text-white/60 hover:text-white'
              }`}
            >
              🧘 Relax & Zen (2)
            </button>
          </div>

          {/* PLAYLIST SELECTION TOUCH-SWIPEABLE HORIZONTAL STRIP */}
          <div className="flex items-center space-x-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-1 shrink-0 touch-pan-x no-scrollbar">
            {allAvailablePlaylists.map((pl) => (
              <button
                key={pl.id}
                onClick={() => {
                  soundEngine.playTick();
                  setSelectedPlaylist(pl);
                }}
                className={`px-3 py-1.5 rounded-2xl text-[10px] font-extrabold shrink-0 flex items-center space-x-1.5 border snap-start transition-all active:scale-95 ${
                  selectedPlaylist.id === pl.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-white/40 shadow-lg scale-105'
                    : 'liquid-glass text-white/70 border-white/10 hover:border-white/30'
                }`}
              >
                {pl.category === 'relax' ? (
                  <Smile className="w-3 h-3 text-cyan-300 shrink-0" />
                ) : (
                  <Flame className="w-3 h-3 text-amber-300 shrink-0" />
                )}
                <span className="whitespace-nowrap">{pl.name}</span>
              </button>
            ))}
          </div>

          {/* SPOTIFY EMBEDDED IFRAME PLAYER */}
          <div className="flex-1 rounded-[24px] overflow-hidden border border-emerald-500/20 shadow-2xl relative bg-black/60">
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
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
            <Disc className={`w-4 h-4 ${isSynthPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-white leading-tight">{selectedPlaylist.name}</p>
            <p className="text-[9.5px] text-white/50">{selectedPlaylist.artist}</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>{selectedPlaylist.bpm}</span>
          </div>
        </div>
      </div>

    </div>
  );
};
