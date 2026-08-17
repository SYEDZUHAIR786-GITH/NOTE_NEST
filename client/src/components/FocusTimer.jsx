import React, { useState, useEffect, useRef } from 'react';
import { Clock, Play, Pause, RotateCcw, Bell, AlertTriangle, CheckCircle } from 'lucide-react';

// Play sound synth via Web Audio API (no external file dependencies)
function playAudioNotification(type = 'alert') {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === 'complete') {
      // 3-tone ascending celebration chord (C5 -> E5 -> G5)
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.6);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.6);
      });
    } else {
      // 2-tone notification chime (A5 -> E6)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const gain2 = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1318.51, now + 0.15); // E6
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      gain2.gain.setValueAtTime(0.3, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.start(now);
      osc1.stop(now + 0.3);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.55);
    }
  } catch (err) {
    console.error('Audio chime error:', err);
  }
}

export default function FocusTimer() {
  const INITIAL_SECONDS = 25 * 60; // 25 minutes = 1500 seconds
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  // Track which alerts triggered to prevent repeat audio spam in same session
  const triggeredAlerts = useRef({ min5: false, min3: false, min0: false });

  useEffect(() => {
    let interval = null;

    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          const next = prev - 1;

          // Alert at 5 minutes left (300 seconds)
          if (next === 300 && !triggeredAlerts.current.min5) {
            triggeredAlerts.current.min5 = true;
            playAudioNotification('alert');
            setActiveAlert({
              type: 'warning',
              title: '⏰ 5 Minutes Left!',
              message: 'Wrap up your current study note section.'
            });
          }

          // Alert at 3 minutes left (180 seconds)
          if (next === 180 && !triggeredAlerts.current.min3) {
            triggeredAlerts.current.min3 = true;
            playAudioNotification('alert');
            setActiveAlert({
              type: 'urgent',
              title: '⚠️ 3 Minutes Remaining!',
              message: 'Final review time before session ends.'
            });
          }

          // Complete at 0 seconds
          if (next === 0 && !triggeredAlerts.current.min0) {
            triggeredAlerts.current.min0 = true;
            playAudioNotification('complete');
            setIsRunning(false);
            setActiveAlert({
              type: 'success',
              title: '🎉 Focus Session Complete!',
              message: 'Great job! Take a 5-minute break.'
            });
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = (mins = 25) => {
    setIsRunning(false);
    setSecondsLeft(mins * 60);
    setActiveAlert(null);
    triggeredAlerts.current = { min5: false, min3: false, min0: false };
  };

  // Format seconds into MM:SS
  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
      borderRadius: 16,
      padding: '1.5rem',
      color: '#080c14',
      boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.4)',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Focus Timer
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => handleReset(25)}
            title="Reset Timer"
            style={{ background: 'transparent', border: 'none', color: '#080c14', cursor: 'pointer', opacity: 0.8 }}
          >
            <RotateCcw size={16} />
          </button>
          <Clock size={18} />
        </div>
      </div>

      {/* Countdown Display */}
      <div style={{
        fontSize: '2.6rem',
        fontWeight: 900,
        textAlign: 'center',
        margin: '0.25rem 0 1rem',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.02em',
        lineHeight: 1
      }}>
        {formatTime(secondsLeft)}
      </div>

      {/* Alert Banner Popup */}
      {activeAlert && (
        <div style={{
          background: activeAlert.type === 'urgent' ? '#ef4444' : activeAlert.type === 'warning' ? '#eab308' : '#080c14',
          color: '#ffffff',
          borderRadius: 10,
          padding: '0.65rem 0.85rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          animation: 'bounceIn 0.3s ease'
        }}>
          {activeAlert.type === 'urgent' ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> : <Bell size={16} style={{ flexShrink: 0, marginTop: 2 }} />}
          <div>
            <div style={{ fontWeight: 700 }}>{activeAlert.title}</div>
            <div style={{ opacity: 0.9, fontSize: '0.75rem', marginTop: 1 }}>{activeAlert.message}</div>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={handleToggle}
          style={{
            flex: 1,
            background: '#080c14',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '0.75rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease'
          }}
        >
          {isRunning ? (
            <>
              <Pause size={16} fill="currentColor" />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              <span>{secondsLeft === 0 ? 'Restart Session' : 'Start Session'}</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.85rem' }}>
        <button
          onClick={() => handleReset(25)}
          style={{
            background: 'rgba(8, 12, 20, 0.2)',
            border: 'none',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#080c14',
            cursor: 'pointer'
          }}
        >
          25m Focus
        </button>
        <button
          onClick={() => handleReset(15)}
          style={{
            background: 'rgba(8, 12, 20, 0.2)',
            border: 'none',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#080c14',
            cursor: 'pointer'
          }}
        >
          15m Quick
        </button>
        <button
          onClick={() => handleReset(5)}
          style={{
            background: 'rgba(8, 12, 20, 0.2)',
            border: 'none',
            borderRadius: 6,
            padding: '2px 8px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: '#080c14',
            cursor: 'pointer'
          }}
        >
          5m Break
        </button>
      </div>
    </div>
  );
}
