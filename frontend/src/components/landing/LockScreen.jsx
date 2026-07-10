import './LockScreen.css';

export default function LockScreen({
  isAuthenticated,
  userName,
  entered,
  onSignIn,
  onCreateAccount,
  onEnter,
}) {
  return (
    <section
      aria-hidden={entered}
      className={`co-lock-screen ${entered ? 'is-entered' : ''}`}
    >
      <div className="co-lock-screen__content">
        <span className="co-lock-screen__brand">ClubOps</span>
        <p className="co-lock-screen__eyebrow">{isAuthenticated ? 'Welcome back,' : 'Welcome,'}</p>
        <h1>{isAuthenticated ? userName : 'Space Builder'}</h1>
        <p className="co-lock-screen__message">
          {isAuthenticated
            ? 'Your workspace is ready. Scroll or continue to step inside.'
            : 'Your workspace already exists. Authenticate to enter it.'}
        </p>

        {isAuthenticated ? (
          <div className="co-lock-screen__entered-actions">
            <button className="co-button co-button--primary" type="button" onClick={onEnter}>
              Continue to Dashboard
            </button>
            <button className="co-lock-screen__scroll-hint" type="button" onClick={onEnter}>
              <span>Continue</span>
              <span aria-hidden="true">↓</span>
            </button>
          </div>
        ) : (
          <div className="co-lock-screen__actions">
            <button className="co-button co-button--primary" type="button" onClick={onSignIn}>
              Sign In
            </button>
            <button className="co-button" type="button" onClick={onCreateAccount}>
              Create Account
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
