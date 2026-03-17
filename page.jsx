'use client';

import { useState } from 'react';
import FitPulseHome from '@/components/FitPulseHome';
import WorkoutSetup from '@/components/WorkoutSetup';
import WorkoutConfig from '@/components/WorkoutConfig';
import WorkoutSession from '@/components/WorkoutSession';
import WorkoutResults from '@/components/WorkoutResults';
import WorkoutHistory from '@/components/WorkoutHistory';
import ExerciseDemo from '@/components/ExerciseDemo';
import SettingsPanel from '@/components/SettingsPanel';

export default function Home() {
  const [stage, setStage] = useState('home');
  const [workoutConfig, setWorkoutConfig] = useState(null);
  const [workoutResults, setWorkoutResults] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuth, setSpotifyAuth] = useState(null);

  const handleStartWorkout = () => {
    setStage('setup');
  };

  const handleSetupNext = (config) => {
    setWorkoutConfig(config);
    setStage('config');
  };

  const handleConfigStart = (config) => {
    setWorkoutConfig(config);
    setStage('workout');
  };

  const handleWorkoutComplete = (results) => {
    setWorkoutResults(results);
    setStage('results');
  };

  const handleNewWorkout = () => {
    setStage('home');
    setWorkoutConfig(null);
    setWorkoutResults(null);
  };

  return (
    <main>
      {stage === 'home' && (
        <FitPulseHome
          onStart={handleStartWorkout}
          onViewHistory={() => setStage('history')}
          onViewDemos={() => setStage('demos')}
          onSettings={() => setShowSettings(!showSettings)}
        />
      )}

      {stage === 'setup' && (
        <WorkoutSetup onNext={handleSetupNext} onBack={() => setStage('home')} />
      )}

      {stage === 'config' && workoutConfig && (
        <WorkoutConfig
          config={workoutConfig}
          onStart={handleConfigStart}
          onBack={() => setStage('setup')}
        />
      )}

      {stage === 'workout' && workoutConfig && (
        <WorkoutSession
          config={workoutConfig}
          onComplete={handleWorkoutComplete}
          onCancel={() => setStage('home')}
        />
      )}

      {stage === 'results' && workoutResults && (
        <WorkoutResults
          results={workoutResults}
          onNewWorkout={handleNewWorkout}
          onViewHistory={() => setStage('history')}
        />
      )}

      {stage === 'history' && <WorkoutHistory onBack={() => setStage('home')} />}

      {stage === 'demos' && <ExerciseDemo onBack={() => setStage('home')} />}

      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} onSpotifyAuth={setSpotifyAuth} />
      )}
    </main>
  );
}
