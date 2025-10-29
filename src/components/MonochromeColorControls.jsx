import React, { useState, useEffect } from 'react';
import { Palette, X } from 'lucide-react';

export default function MonochromeColorControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(272);
  const [saturation, setSaturation] = useState(92);
  const [lightness, setLightness] = useState(69);

  // Update CSS custom properties
  const updateColors = (newHue, newSaturation, newLightness) => {
    document.documentElement.style.setProperty('--primary-hue', newHue);
    document.documentElement.style.setProperty('--base-saturation', `${newSaturation}%`);
    document.documentElement.style.setProperty('--base-lightness', `${newLightness}%`);
  };

  useEffect(() => {
    updateColors(hue, saturation, lightness);
  }, [hue, saturation, lightness]);

  // Keyboard shortcut - Press 'R' to randomize
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        setHue(Math.floor(Math.random() * 360));
        setSaturation(Math.floor(Math.random() * 70) + 30);
        setLightness(Math.floor(Math.random() * 60) + 20);
      }
      if (e.key === 'c' || e.key === 'C') {
        setIsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Create particle effect
  const createParticle = (x, y) => {
    const particle = document.createElement('div');
    particle.className = 'monochrome-particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const size = Math.random() * 6 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 3000);
  };

  // Mouse move particles
  useEffect(() => {
    let mouseTimeout;
    const handleMouseMove = (e) => {
      clearTimeout(mouseTimeout);
      mouseTimeout = setTimeout(() => {
        if (Math.random() > 0.85) {
          createParticle(e.clientX, e.clientY);
        }
      }, 50);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(mouseTimeout);
    };
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="monochrome-control-toggle"
        aria-label="Toggle color controls"
        title="Toggle color palette (C)"
      >
        {isOpen ? <X size={24} color="white" /> : <Palette size={24} color="white" />}
      </button>

      {/* Controls Panel */}
      <div className={`monochrome-color-controls ${!isOpen ? 'collapsed' : ''}`}>
        <h3 style={{ color: 'var(--tint-lightest)', marginBottom: '1rem', fontSize: '1rem', fontWeight: 'bold' }}>
          Color Palette
        </h3>

        {/* Hue Control */}
        <div className="monochrome-control-group">
          <label htmlFor="hue-control">
            Hue (Color)
          </label>
          <input
            id="hue-control"
            type="range"
            min="0"
            max="360"
            value={hue}
            onChange={(e) => setHue(parseInt(e.target.value))}
          />
          <span className="monochrome-control-value">{hue}°</span>
        </div>

        {/* Saturation Control */}
        <div className="monochrome-control-group">
          <label htmlFor="saturation-control">
            Saturation
          </label>
          <input
            id="saturation-control"
            type="range"
            min="0"
            max="100"
            value={saturation}
            onChange={(e) => setSaturation(parseInt(e.target.value))}
          />
          <span className="monochrome-control-value">{saturation}%</span>
        </div>

        {/* Lightness Control */}
        <div className="monochrome-control-group">
          <label htmlFor="lightness-control">
            Lightness
          </label>
          <input
            id="lightness-control"
            type="range"
            min="10"
            max="90"
            value={lightness}
            onChange={(e) => setLightness(parseInt(e.target.value))}
          />
          <span className="monochrome-control-value">{lightness}%</span>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setHue(272); setSaturation(92); setLightness(69); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'hsl(272, 92%, 69%)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.75rem'
            }}
            title="Purple"
          >
            Purple
          </button>
          <button
            onClick={() => { setHue(200); setSaturation(85); setLightness(60); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'hsl(200, 85%, 60%)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.75rem'
            }}
            title="Cyan"
          >
            Cyan
          </button>
          <button
            onClick={() => { setHue(330); setSaturation(90); setLightness(65); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '8px',
              background: 'hsl(330, 90%, 65%)',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '0.75rem'
            }}
            title="Pink"
          >
            Pink
          </button>
        </div>

        {/* Hint */}
        <p style={{
          color: 'var(--tone-light)',
          fontSize: '0.7rem',
          marginTop: '1rem',
          textAlign: 'center'
        }}>
          Press <kbd style={{
            background: 'var(--base-alpha-20)',
            padding: '0.2rem 0.4rem',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}>R</kbd> for random colors
        </p>
      </div>
    </>
  );
}
