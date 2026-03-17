'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, StopCircle, Volume2, Settings, RotateCcw } from 'lucide-react';

export default function FitPulseV7() {
  const [stage, setStage] = useState('home');
  const [ageGroup, setAgeGroup] = useState('13-17');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [duration, setDuration] = useState(20);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.2);
  const synth = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            moveToNextExercise();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft]);

  const exercises = {
    skipping: { caloriesPerMin: { light: 8, intermediate: 12, vigorous: 15 }, description: 'Skipping', tips: 'Keep steady rhythm.' },
    plank: { caloriesPerMin: { light: 3, intermediate: 4.5, vigorous: 6 }, description: 'Plank Hold', tips: 'Keep your body straight.' },
    sidePlank: { caloriesPerMin: { light: 3, intermediate: 4, vigorous: 5.5 }, description: 'Side Plank', tips: 'Keep your hips high.' },
    crunches: { caloriesPerMin: { light: 2, intermediate: 3, vigorous: 4 }, description: 'Crunches', tips: 'Lift your shoulders only.' },
    bicycleCrunches: { caloriesPerMin: { light: 3, intermediate: 4.5, vigorous: 6 }, description: 'Bicycle Crunches', tips: 'Alternate sides smoothly.' },
    mountainClimbers: { caloriesPerMin: { light: 7, intermediate: 10, vigorous: 13 }, description: 'Mountain Climbers', tips: 'Keep hips level!' },
    legRaises: { caloriesPerMin: { light: 3, intermediate: 4.5, vigorous: 6 }, description: 'Leg Raises', tips: 'Lift legs slowly.' },
    balanceBoard: { caloriesPerMin: { light: 4, intermediate: 5, vigorous: 7 }, description: 'Balance Board', tips: 'Focus on stability.' },
    jumpingJacks: { caloriesPerMin: { light: 6, intermediate: 8, vigorous: 11 }, description: 'Jumping Jacks', tips: 'Keep a steady pace.' },
    pushups: { caloriesPerMin: { light: 5, intermediate: 7, vigorous: 10 }, description: 'Push-ups', tips: 'Keep elbows close!' },
    squats: { caloriesPerMin: { light: 4, intermediate: 6, vigorous: 8 }, description: 'Squats', tips: 'Keep your chest up!' },
    gluteBridges: { caloriesPerMin: { light: 3, intermediate: 4, vigorous: 5.5 }, description: 'Glute Bridges', tips: 'Squeeze glutes at top!' },
  };

  const goals = {
    general: ['skipping', 'pushups', 'squats', 'mountainClimbers'],
    core: ['plank', 'sidePlank', 'mountainClimbers', 'crunches'],
    cardio: ['skipping', 'jumpingJacks', 'mountainClimbers'],
    strength: ['pushups', 'squats', 'gluteBridges', 'plank'],
    balance: ['balanceBoard', 'sidePlank', 'legRaises'],
    hiit: ['jumpingJacks', 'mountainClimbers', 'squats'],
  };

  const generatePlan = () => {
    const exercisesToUse = selectedGoal ? goals[selectedGoal] : selectedExercises;
    const sets = fitnessLevel === 'light' ? 2 : fitnessLevel === 'intermediate' ? 3 : 4;
    const plan = [];

    for (let set = 1; set <= sets; set++) {
      for (const ex of exercisesToUse) {
        plan.push({ exercise: ex, duration: 45, type: 'exercise', set, totalSets: sets });
      }
      if (set < sets) {
        plan.push({ type: 'rest', duration: 45 });
      }
    }

    setWorkoutPlan(plan);
    setCurrentIndex(0);
    setTimeLeft(plan[0]?.duration || 45);
  };

  const startWorkout = () => {
    generatePlan();
    setStage('workout');
    setIsRunning(true);
  };

  const moveToNextExercise = () => {
    if (currentIndex < workoutPlan.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(workoutPlan[nextIndex].duration);
    } else {
      setStage('results');
      setIsRunning(false);
    }
  };

  const speak = (text) => {
    if (synth.current) {
      synth.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;
      synth.current.speak(utterance);
    }
  };

  const colors = {
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    light: '#eff6ff',
    text: '#0f172a',
    success: '#059669',
  };

  // HOME SCREEN
  if (stage === 'home') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Lora, Georgia, serif', minHeight: '100vh', background: colors.light }}>
        <h1 style={{ fontSize: '3em', color: colors.primary, marginBottom: '20px' }}>🏋️ FitPulse</h1>
        <p style={{ fontSize: '1.2em', color: colors.text, marginBottom: '30px' }}>Your Personal Fitness Coach</p>
        <button
          onClick={() => setStage('setup')}
          style={{
            padding: '12px 30px',
            fontSize: '1.1em',
            background: colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Start Workout
        </button>
      </div>
    );
  }

  // SETUP SCREEN
  if (stage === 'setup') {
    return (
      <div style={{ padding: '40px', fontFamily: 'Lora, Georgia, serif', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', background: colors.light }}>
        <h2 style={{ color: colors.primary }}>Configure Your Workout</h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Age Group:</label>
          <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option>13-17</option>
            <option>18-25</option>
            <option>26-35</option>
            <option>36-50</option>
            <option>50+</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Fitness Level:</label>
          <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="light">Light</option>
            <option value="intermediate">Intermediate</option>
            <option value="vigorous">Vigorous</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Duration (minutes): {duration}</label>
          <input type="range" min="5" max="60" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Select a Goal:</label>
          {Object.keys(goals).map((goal) => (
            <button
              key={goal}
              onClick={() => {
                setSelectedGoal(goal);
                setSelectedExercises([]);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px',
                marginBottom: '8px',
                background: selectedGoal === goal ? colors.primary : '#e0e7ff',
                color: selectedGoal === goal ? 'white' : colors.text,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {goal.charAt(0).toUpperCase() + goal.slice(1)}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            generatePlan();
            setStage('workout');
          }}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1.1em',
            background: colors.success,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🚀 Start Workout
        </button>
      </div>
    );
  }

  // WORKOUT SCREEN
  if (stage === 'workout') {
    const current = workoutPlan[currentIndex];
    const exerciseData = current?.type === 'exercise' ? exercises[current.exercise] : null;

    return (
      <div style={{ padding: '40px', fontFamily: 'Lora, Georgia, serif', minHeight: '100vh', background: colors.light, textAlign: 'center' }}>
        <h2 style={{ color: colors.primary, marginBottom: '30px' }}>
          {current?.type === 'exercise' ? `💪 ${exerciseData?.description}` : '😤 Rest Time'}
        </h2>

        <div style={{ fontSize: '4em', color: colors.primary, marginBottom: '30px', fontWeight: 'bold' }}>
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
        </div>

        <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {!isRunning ? (
            <button onClick={() => { setIsRunning(true); setIsPaused(false); speak('Starting ' + (current?.type === 'exercise' ? exerciseData?.description : 'rest')); }} style={{ padding: '10px 20px', background: colors.success, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              <Play size={20} /> Play
            </button>
          ) : (
            <>
              <button onClick={() => setIsPaused(!isPaused)} style={{ padding: '10px 20px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                <Pause size={20} /> {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button onClick={() => { setIsRunning(false); setStage('home'); }} style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                <StopCircle size={20} /> Stop
              </button>
            </>
          )}
        </div>

        <p style={{ color: colors.text, marginBottom: '30px' }}>
          Exercise {currentIndex + 1} of {workoutPlan.length}
        </p>

        {exerciseData && (
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <p style={{ color: colors.text }}>{exerciseData.tips}</p>
          </div>
        )}
      </div>
    );
  }

  // RESULTS SCREEN
  if (stage === 'results') {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Lora, Georgia, serif', minHeight: '100vh', background: colors.light }}>
        <h1 style={{ color: colors.success, marginBottom: '20px' }}>🎉 Workout Complete!</h1>
        <p style={{ fontSize: '1.2em', color: colors.text, marginBottom: '30px' }}>Great job! You completed {workoutPlan.length} exercises.</p>
        <button
          onClick={() => setStage('home')}
          style={{ padding: '12px 30px', fontSize: '1.1em', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Back to Home
        </button>
      </div>
    );
  }
}
