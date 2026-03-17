'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { initiateSpotifyAuth, getStoredSpotifyToken } from '@/lib/spotify';

export default function SettingsPanel({ onClose, onSpotifyAuth }) {
  const [spotifyAuth, setSpotifyAuth] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    // Check for stored Spotify token
    const token = getStoredSpotifyToken();
    if (token) {
      setSpotifyAuth(token);
    }

    // Check URL for redirect from Spotify
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      if (token) {
        setSpotifyAuth(token);
        localStorage.setItem('spotify_token', token);
        localStorage.setItem('spotify_token_time', Date.now().toString());
        window.location.hash = '';
      }
    }
  }, []);

  const handleSpotifyConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      alert('Spotify credentials not configured. Please set environment variables.');
      return;
    }

    const authUrl = initiateSpotifyAuth(clientId, redirectUri);
    window.location.href = authUrl;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-6">
      <div className="bg-slate-800 border border-cyan-500/30 rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Voice Guidance */}
          <div>
            <label className="text-gray-300 font-semibold block mb-2">🎤 Voice Guidance</label>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                voiceEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-400'
              }`}
            >
              {voiceEnabled ? 'ON' : 'OFF'}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Receive voice coaching and motivation during your workout
            </p>
          </div>

          {/* Spotify Connection */}
          <div>
            <label className="text-gray-300 font-semibold block mb-2">🎵 Spotify Music</label>
            <button
              onClick={handleSpotifyConnect}
              className={`w-full px-4 py-2 rounded-lg font-semibold transition ${
                spotifyAuth
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
              }`}
            >
              {spotifyAuth ? '✓ Connected' : 'Connect Spotify'}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Connect your Spotify account to play music during workouts (requires Premium)
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-slate-700/50 rounded-lg p-4 mt-6 border border-slate-600">
            <h3 className="text-cyan-300 font-semibold mb-2 text-sm">💡 Tips</h3>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Keep Spotify app open for music playback</li>
              <li>• Voice guidance uses your browser's text-to-speech</li>
              <li>• Workouts auto-save to your device</li>
            </ul>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
