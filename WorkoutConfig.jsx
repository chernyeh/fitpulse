'use client';

import { useState } from 'react';
import { exercises, goals, calculateCalorieOptions } from '@/lib/exercises';

export default function WorkoutConfig({ config, onStart, onBack }) {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [calorieTarget, setCalorieTarget] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const calorieOptions = calculateCalorieOptions(config.duration, config.fitnessLevel);

  const handleStart = () => {
    if (!selectedGoal && selectedExercises.length === 0) {
      alert('Please select a goal or specific exercises');
      return;
    }

    onStart({
      ...config,
      selectedGoal,
      selectedExercises,
      calorieTarget,
      voiceEnabled,
      musicEnabled,
    });
  };

  const toggleExercise = (exerciseKey) => {
    setSelectedGoal(null); // Clear goal if selecting custom exercises
    setSelectedExercises((prev) =>
      prev.includes(exerciseKey) ? prev.filter((e) => e !== exerciseKey) : [...prev, exerciseKey]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-cyan-400 mb-8" style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.1em' }}>
          BUILD YOUR WORKOUT
        </h1>

        <div className="space-y-8">
          {/* Preset Goals */}
          <div>
            <h2 className="text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">Quick Goals</h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(goals).map(([key, goal]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedGoal(key);
                    setSelectedExercises([]);
                  }}
                  className={`p-4 rounded-lg font-semibold transition text-left ${
                    selectedGoal === key
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-2 border-purple-300'
                      : 'bg-slate-800 text-gray-300 border border-slate-700 hover:border-purple-500'
                  }`}
                >
                  <div className="text-lg">{goal.icon}</div>
                  <div className="font-bold">{goal.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Exercise Selection */}
          <div>
            <h2 className="text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Or Select Individual Exercises
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(exercises).map(([key, data]) => (
                <button
                  key={key}
                  onClick={() => toggleExercise(key)}
                  className={`p-4 rounded-lg font-semibold transition text-left ${
                    selectedExercises.includes(key)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-slate-800 text-gray-300 border border-slate-700 hover:border-cyan-500'
                  }`}
                >
                  <div className="text-lg">{data.icon}</div>
                  <div className="font-bold">{data.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Calorie Target */}
          <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Target Calories to Burn
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {calorieOptions.map((cal) => (
                <button
                  key={cal}
                  onClick={() => setCalorieTarget(cal)}
                  className={`py-3 rounded-lg font-bold transition ${
                    calorieTarget === cal
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {cal} cal
                </button>
              ))}
            </div>
          </div>

          {/* Voice & Music */}
          <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-semibold">🎤 Voice Guidance</span>
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  voiceEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-400'
                }`}
              >
                {voiceEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 font-semibold">🎵 Workout Music</span>
              <button
                onClick={() => setMusicEnabled(!musicEnabled)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  musicEnabled ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-400'
                }`}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>

            {musicEnabled && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-gray-400">
                  💡 Tip: Make sure Spotify app is open on your phone/computer for music playback
                </p>
              </div>
            )}
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🚀 Start Your Workout
          </button>
        </div>
      </div>
    </div>
  );
}
