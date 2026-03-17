'use client';

import { Award } from 'lucide-react';

export default function WorkoutResults({ results, onNewWorkout, onViewHistory }) {
  const totalCalories = Object.values(results).reduce((sum, ex) => sum + ex.totalCalories, 0);
  const totalExercises = Object.keys(results).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
      `}</style>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1
            className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.1em' }}
          >
            WORKOUT COMPLETE!
          </h1>
          <p className="text-gray-400">Amazing effort! Here's your summary:</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">{totalCalories}</div>
            <div className="text-cyan-200 text-sm">Total Calories Burned</div>
          </div>
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">
              {Math.round((totalCalories / 3500) * 100) / 100}
            </div>
            <div className="text-purple-200 text-sm">Pounds of Fat</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">{totalExercises}</div>
            <div className="text-green-200 text-sm">Exercises Completed</div>
          </div>
        </div>

        {/* Exercise Breakdown */}
        <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-8 mb-8">
          <h2 className="text-cyan-300 font-bold text-lg mb-6 uppercase tracking-wider">
            Breakdown by Exercise
          </h2>
          <div className="space-y-4">
            {Object.entries(results).map(([key, data]) => (
              <div key={key} className="flex justify-between items-center pb-4 border-b border-slate-700 last:border-0">
                <div>
                  <p className="font-semibold text-white">{data.name}</p>
                  <p className="text-sm text-gray-400">{data.sets} sets • {Math.round(data.totalTime / 60)}m</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-400">{data.totalCalories} cal</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Message */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6 mb-8 text-center">
          <p className="text-gray-200 font-semibold mb-2">🔥 You Crushed It!</p>
          <p className="text-gray-300">
            You burned approximately{' '}
            <span className="text-orange-400 font-bold">{Math.round((totalCalories / 3500) * 100) / 100}</span> pounds of
            fat. Keep up this intensity and you'll see amazing results!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onNewWorkout}
            className="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
          >
            Start New Workout
          </button>
          <button
            onClick={onViewHistory}
            className="flex-1 py-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
