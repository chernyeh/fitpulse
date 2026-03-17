'use client';

import { useState } from 'react';

export default function WorkoutSetup({ onNext, onBack }) {
  const [ageRange, setAgeRange] = useState('25-35');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [duration, setDuration] = useState(25);

  const handleNext = () => {
    onNext({ ageRange, fitnessLevel, duration });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>

      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-cyan-400" style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.1em' }}>
            NEW WORKOUT
          </h1>
        </div>

        <div className="space-y-8">
          {/* Age Range */}
          <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition">
            <label className="block text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Age Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['18-24', '25-35', '36-50', '50+'].map((range) => (
                <button
                  key={range}
                  onClick={() => setAgeRange(range)}
                  className={`py-3 rounded-lg font-semibold transition ${
                    ageRange === range
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Level */}
          <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition">
            <label className="block text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Fitness Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['light', 'intermediate', 'vigorous'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFitnessLevel(level)}
                  className={`py-3 rounded-lg font-semibold transition ${
                    fitnessLevel === level
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {fitnessLevel === 'light' && '🟢 Easy pace, ideal for beginners or recovery'}
              {fitnessLevel === 'intermediate' && '🟡 Moderate intensity, challenging but sustainable'}
              {fitnessLevel === 'vigorous' && '🔴 High intensity, maximum effort and calorie burn'}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/60 transition">
            <label className="block text-cyan-300 font-semibold mb-4 text-sm uppercase tracking-wider">
              Duration (minutes)
            </label>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-center mt-3">
              <div className="text-3xl font-bold text-cyan-400">{duration} mins</div>
              <div className="text-sm text-gray-400 mt-2">
                {duration <= 20 && '⚡ Quick energizer'}
                {duration > 20 && duration <= 35 && '💪 Standard workout'}
                {duration > 35 && '🔥 Extended session'}
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition text-lg"
          >
            Choose Your Workout →
          </button>
        </div>
      </div>
    </div>
  );
}
