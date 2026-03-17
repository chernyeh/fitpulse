'use client';

import { useState, useEffect } from 'react';
import { Settings, History, Video, Zap, Award } from 'lucide-react';
import { loadWorkoutHistory, calculateStats } from '@/lib/storage';

export default function FitPulseHome({ onStart, onViewHistory, onViewDemos, onSettings }) {
  const [stats, setStats] = useState({ totalWorkouts: 0, totalCalories: 0, totalTime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const history = await loadWorkoutHistory();
      const calculated = calculateStats(history);
      setStats(calculated);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        
        .pulse-glow {
          animation: glowPulse 3s ease-in-out infinite;
        }
        
        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(6, 182, 212, 0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(6, 182, 212, 0.8)); }
        }
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-6xl font-bold mb-2" style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.15em' }}>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent pulse-glow">
                FITPULSE
              </span>
            </h1>
            <p className="text-cyan-300 text-lg font-light">v2.0 — Personal AI Fitness Coach</p>
          </div>
          <button
            onClick={onSettings}
            className="p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition"
            title="Settings"
          >
            <Settings size={24} className="text-cyan-400" />
          </button>
        </div>

        {/* Quick Stats */}
        {stats.totalWorkouts > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">{stats.totalWorkouts}</div>
              <p className="text-cyan-200 text-sm">Total Workouts</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">{stats.totalCalories}</div>
              <p className="text-purple-200 text-sm">Calories Burned</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-white">{Math.round(stats.totalTime / 60)}h</div>
              <p className="text-orange-200 text-sm">Total Time</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={onStart}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition text-lg flex items-center justify-center gap-3"
          >
            <Zap size={24} /> Start New Workout
          </button>

          {stats.totalWorkouts > 0 && (
            <button
              onClick={onViewHistory}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition text-lg flex items-center justify-center gap-3"
            >
              <History size={24} /> Workout History ({stats.totalWorkouts})
            </button>
          )}

          <button
            onClick={onViewDemos}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition text-lg flex items-center justify-center gap-3"
          >
            <Video size={24} /> Exercise Demos & Form
          </button>
        </div>

        {/* Welcome Message */}
        {stats.totalWorkouts === 0 && (
          <div className="mt-12 bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-8 text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">Welcome to FitPulse!</h2>
            <p className="text-gray-300 mb-4">
              Your personal AI fitness coach is ready to help you achieve your goals.
            </p>
            <p className="text-gray-400">
              Start your first workout to begin tracking your progress!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
