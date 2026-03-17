'use client';

import { useState, useEffect } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { loadWorkoutHistory, deleteWorkout, calculateStats, exportWorkoutHistoryCSV } from '@/lib/storage';
import { goals } from '@/lib/exercises';

export default function WorkoutHistory({ onBack }) {
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await loadWorkoutHistory();
      setWorkoutHistory(history);
      setStats(calculateStats(history));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;

    try {
      const keyToDelete = `workout:${workoutHistory[index].date}`;
      await deleteWorkout(`workout:${Date.parse(workoutHistory[index].date)}`);
      const updated = workoutHistory.filter((_, i) => i !== index);
      setWorkoutHistory(updated);
      setStats(calculateStats(updated));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-cyan-400 text-2xl">Loading...</div>
      </div>
    );
  }

  if (selectedWorkout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setSelectedWorkout(null)}
            className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
          >
            ← Back to History
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              {new Date(selectedWorkout.date).toLocaleDateString()} at{' '}
              {new Date(selectedWorkout.date).toLocaleTimeString()}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Duration</p>
                <p className="text-cyan-400 font-bold text-lg">{selectedWorkout.duration} mins</p>
              </div>
              <div>
                <p className="text-gray-400">Calories Burned</p>
                <p className="text-orange-400 font-bold text-lg">{selectedWorkout.totalCalories} cal</p>
              </div>
              <div>
                <p className="text-gray-400">Fitness Level</p>
                <p className="text-purple-400 font-bold text-lg capitalize">{selectedWorkout.fitnessLevel}</p>
              </div>
              <div>
                <p className="text-gray-400">Goal</p>
                <p className="text-blue-400 font-bold text-lg">
                  {selectedWorkout.goal ? goals[selectedWorkout.goal]?.name : 'Custom'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-6">
            <h3 className="text-cyan-300 font-semibold mb-4">Exercises Completed</h3>
            <div className="space-y-3">
              {Object.entries(selectedWorkout.exercises || {}).map(([key, data]) => (
                <div key={key} className="flex justify-between items-center pb-3 border-b border-slate-600 last:border-0">
                  <div>
                    <p className="font-semibold text-white">{data.name}</p>
                    <p className="text-sm text-gray-400">{data.sets} sets</p>
                  </div>
                  <p className="text-orange-400 font-bold">{data.totalCalories} cal</p>
                </div>
              ))}
            </div>
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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400" style={{ fontFamily: 'Bebas Neue' }}>
            Workout History
          </h1>
          {workoutHistory.length > 0 && (
            <button
              onClick={() => exportWorkoutHistoryCSV(workoutHistory)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition flex items-center gap-2"
            >
              <Download size={20} /> Export CSV
            </button>
          )}
        </div>

        {/* Stats */}
        {stats && stats.totalWorkouts > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.totalWorkouts}</div>
              <p className="text-gray-400 text-sm">Total Workouts</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.totalCalories}</div>
              <p className="text-gray-400 text-sm">Total Calories</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.round(stats.totalTime / 60)}h</div>
              <p className="text-gray-400 text-sm">Total Time</p>
            </div>
          </div>
        )}

        {/* Workout List */}
        <div className="space-y-3">
          {workoutHistory.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-8 text-center">
              <p className="text-gray-400">No workouts yet. Complete your first workout to see history!</p>
            </div>
          ) : (
            workoutHistory.map((workout, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500 transition cursor-pointer flex justify-between items-center"
              >
                <div onClick={() => setSelectedWorkout(workout)} className="flex-1">
                  <h3 className="font-bold text-cyan-400 mb-1">
                    {new Date(workout.date).toLocaleDateString()}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {workout.duration} mins • {workout.totalCalories} cal •{' '}
                    {goals[workout.goal]?.name || 'Custom'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(idx);
                  }}
                  className="p-2 hover:bg-red-600/20 rounded-lg transition ml-4"
                >
                  <Trash2 size={20} className="text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
