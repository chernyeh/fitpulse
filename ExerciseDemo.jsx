'use client';

import { useState } from 'react';
import { exercises } from '@/lib/exercises';

export default function ExerciseDemo({ onBack }) {
  const [selectedExercise, setSelectedExercise] = useState(null);

  if (selectedExercise) {
    const exercise = exercises[selectedExercise];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedExercise(null)}
            className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
          >
            ← Back to Exercises
          </button>

          <h2 className="text-3xl font-bold text-cyan-400 mb-6">{exercise.description}</h2>

          {/* YouTube Video */}
          <div className="mb-8 aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${exercise.videoId}`}
              title={exercise.description}
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Tips */}
          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-cyan-300 font-semibold mb-3">Form Tips</h3>
            <p className="text-gray-300">{exercise.tips}</p>
          </div>

          {/* Calorie Info */}
          <div className="grid grid-cols-3 gap-4">
            {['light', 'intermediate', 'vigorous'].map((level) => (
              <div key={level} className="bg-slate-700 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm capitalize mb-2">{level}</p>
                <p className="text-cyan-400 font-bold text-lg">{exercise.caloriesPerMin[level]} cal/min</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-cyan-400 mb-8" style={{ fontFamily: 'Bebas Neue' }}>
          Exercise Demos
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(exercises).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedExercise(key)}
              className="bg-slate-800 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500 transition text-left hover:bg-slate-700/50"
            >
              <div className="text-4xl mb-3">{data.icon}</div>
              <h3 className="font-bold text-cyan-400 mb-2 text-lg">{data.description}</h3>
              <p className="text-gray-400 text-sm">{data.tips}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
