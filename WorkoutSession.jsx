'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, Video } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';
import { useVoice } from '@/hooks/useVoice';
import { exercises } from '@/lib/exercises';
import { generateWorkoutPlan, calculateWorkoutResults } from '@/lib/workout';
import { saveWorkout } from '@/lib/storage';

export default function WorkoutSession({ config, onComplete, onCancel }) {
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [demoExercise, setDemoExercise] = useState(null);

  const timer = useTimer();
  const voice = useVoice(config.voiceEnabled);

  // Generate workout plan on mount
  useEffect(() => {
    const plan = generateWorkoutPlan(config);
    setWorkoutPlan(plan);
    if (plan.length > 0) {
      timer.setDuration(plan[0].duration);
      timer.startTimer(plan[0].duration);
      voice.speak('Starting your workout. Let\'s go!');
    }
  }, [config]);

  // Handle timer countdown
  useEffect(() => {
    if (timer.timeRemaining === 0 && timer.isRunning && workoutPlan.length > 0) {
      const nextIndex = currentExerciseIndex + 1;

      if (nextIndex < workoutPlan.length) {
        const nextItem = workoutPlan[nextIndex];
        setCurrentExerciseIndex(nextIndex);
        timer.setDuration(nextItem.duration);

        if (nextItem.type === 'rest') {
          voice.speak('Rest time. Catch your breath.');
        } else {
          voice.speak(`Next: ${exercises[nextItem.exercise]?.description}`);
        }
      } else {
        completeWorkout();
      }
    }
  }, [timer.timeRemaining, timer.isRunning, currentExerciseIndex, workoutPlan]);

  const completeWorkout = async () => {
    voice.speak('Workout complete! Excellent work!');
    timer.resetTimer();

    const results = calculateWorkoutResults(workoutPlan, config.fitnessLevel);
    const totalCalories = Object.values(results).reduce((sum, ex) => sum + ex.totalCalories, 0);

    const workoutData = {
      fitnessLevel: config.fitnessLevel,
      duration: config.duration,
      goal: config.selectedGoal || 'custom',
      totalCalories,
      totalTime: timer.totalTimeUsed,
      exercises: results,
    };

    try {
      await saveWorkout(workoutData);
    } catch (error) {
      console.error('Error saving workout:', error);
    }

    onComplete(results);
  };

  const currentItem = workoutPlan[currentExerciseIndex];
  const isRest = currentItem?.type === 'rest';
  const exerciseName = isRest ? 'Rest' : exercises[currentItem?.exercise]?.description;
  const progress = workoutPlan.length > 0 ? Math.round(((currentExerciseIndex + 1) / workoutPlan.length) * 100) : 0;
  const minutes = Math.floor(timer.timeRemaining / 60);
  const seconds = timer.timeRemaining % 60;

  if (showDemo && demoExercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full">
          <button
            onClick={() => setShowDemo(false)}
            className="mb-6 text-cyan-300 hover:text-cyan-200 flex items-center gap-2"
          >
            ← Back to Workout
          </button>

          <h2 className="text-3xl font-bold text-cyan-400 mb-6">
            {exercises[demoExercise].description}
          </h2>

          <div className="mb-8 aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${exercises[demoExercise].videoId}`}
              title={exercises[demoExercise].description}
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="bg-slate-700 rounded-lg p-6 mb-6">
            <h3 className="text-cyan-300 font-semibold mb-3">Form Tips</h3>
            <p className="text-gray-300">{exercises[demoExercise].tips}</p>
          </div>

          <button
            onClick={() => setShowDemo(false)}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg"
          >
            Continue Workout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{progress}% Complete</p>
        </div>

        {/* Exercise Name */}
        <div className="text-center mb-12">
          <div className={`text-5xl font-bold mb-4 ${isRest ? 'text-green-400' : 'text-cyan-400'}`}>
            {exerciseName}
          </div>
          {!isRest && currentItem && (
            <p className="text-gray-400">
              Set {currentItem.set} of {currentItem.totalSets}
            </p>
          )}
        </div>

        {/* Timer */}
        <div className="mb-12 text-center">
          <div className={`text-9xl font-bold font-mono ${isRest ? 'text-green-400' : 'text-cyan-400'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={() => (timer.isRunning ? timer.pauseTimer() : timer.resumeTimer())}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition flex items-center gap-2"
          >
            {timer.isRunning ? <Pause size={24} /> : <Play size={24} />}
            {timer.isRunning ? 'Pause' : 'Resume'}
          </button>

          {config.voiceEnabled && (
            <button
              onClick={() => voice.speak(exerciseName)}
              className="px-8 py-4 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition flex items-center gap-2"
            >
              <Volume2 size={24} /> Repeat
            </button>
          )}
        </div>

        {/* Form Demo Button */}
        {!isRest && currentItem && (
          <button
            onClick={() => {
              setDemoExercise(currentItem.exercise);
              setShowDemo(true);
            }}
            className="w-full py-3 bg-slate-700 text-white rounded-lg mb-6 flex items-center justify-center gap-2 hover:bg-slate-600 transition"
          >
            <Video size={20} /> Watch Form Demo
          </button>
        )}

        {/* Motivation */}
        <div className="bg-slate-800/50 backdrop-blur border border-cyan-500/30 rounded-lg p-6 text-center">
          <p className="text-gray-300 text-lg">
            {isRest
              ? '💪 You\'re crushing it! Rest well and get ready for the next one!'
              : exercises[currentItem?.exercise]?.tips ||
                'Keep pushing! You\'ve got this!'}
          </p>
        </div>
      </div>
    </div>
  );
}
