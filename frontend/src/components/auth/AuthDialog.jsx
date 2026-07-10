import { useEffect, useRef, useState } from 'react';
import './AuthDialog.css';

export default function AuthDialog({ open, mode, onModeChange, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [previousMode, setPreviousMode] = useState(mode);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const emailInputRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setIsClosing(false);
      setIsTransitioning(false);
      return undefined;
    }
    setIsClosing(false);
    setIsTransitioning(false);
    const inputRef = mode === 'signup' ? nameInputRef : emailInputRef;
    inputRef.current?.focus();
    const handleKeyDown = (event) => { if (event.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, mode]);

  useEffect(() => {
    if (mode !== previousMode && open) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPreviousMode(mode);
        setIsTransitioning(false);
      }, 280);
      return () => clearTimeout(timer);
    }
  }, [mode, previousMode, open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 240);
  };

  if (!open && !isClosing) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try { await onSubmit({ name: name.trim(), email: email.trim(), password }); } finally { setIsSubmitting(false); }
  };

  const handleModeChange = (newMode) => {
    if (newMode !== mode && !isTransitioning) {
      onModeChange(newMode);
    }
  };

  return (
    <div className={`co-auth-dialog ${isClosing ? 'is-closing' : ''}`} role="dialog" aria-modal="true" aria-labelledby="auth-dialog-title">
      <button className="co-auth-dialog__backdrop" type="button" aria-label="Close dialog" onClick={handleClose} />
      <div className="co-auth-dialog__panel">
        <button className="co-auth-dialog__close" type="button" aria-label="Close dialog" onClick={handleClose}>×</button>
        <p className="co-auth-dialog__eyebrow">ClubOps Workspace</p>
        <h2 id="auth-dialog-title">{previousMode === 'signin' ? 'Enter your workspace' : 'Build your space'}</h2>
        <div className="co-auth-dialog__switcher" aria-label="Authentication mode">
          <div className="co-auth-dialog__switcher-track">
            <div 
              className="co-auth-dialog__switcher-indicator" 
              style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)' }}
            />
          </div>
          {['signin', 'signup'].map((option) => (
            <button 
              key={option} 
              className={mode === option ? 'is-active' : ''} 
              type="button" 
              onClick={() => handleModeChange(option)}
            >
              {option === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>
        <div className="co-auth-dialog__form-container">
          <div className={`co-auth-dialog__form-content ${isTransitioning ? 'is-transitioning' : ''}`}>
            <form onSubmit={handleSubmit}>
              {previousMode === 'signup' && (
                <label>Full name
                  <input 
                    ref={nameInputRef}
                    value={name} 
                    onChange={(event) => setName(event.target.value)} 
                    autoComplete="name" 
                    required 
                  />
                </label>
              )}
              <label>Institute email
                <input 
                  ref={emailInputRef}
                  type="email" 
                  value={email} 
                  onChange={(event) => setEmail(event.target.value)} 
                  autoComplete="email" 
                  required 
                />
              </label>
              <label>Password
                <input 
                  type="password" 
                  value={password} 
                  onChange={(event) => setPassword(event.target.value)} 
                  autoComplete={previousMode === 'signin' ? 'current-password' : 'new-password'} 
                  required 
                />
              </label>
              <button className="co-button co-button--primary co-auth-dialog__submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Preparing workspace…' : previousMode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
        <p className="co-auth-dialog__note">Demo-only interface. Account verification will be connected in the authentication milestone.</p>
      </div>
    </div>
  );
}
