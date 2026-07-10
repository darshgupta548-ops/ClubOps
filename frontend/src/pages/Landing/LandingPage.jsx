import { useState } from 'react';
import AuthDialog from '../../components/auth/AuthDialog';
import DashboardPreview from '../../components/domain/dashboard/DashboardPreview';
import { dashboardPreviewData } from '../../components/domain/dashboard/dashboardPreviewData';
import LockScreen from '../../components/landing/LockScreen';
import { useAuth } from '../../context/AuthContext';
import useDashboardReveal from '../../hooks/useDashboardReveal';
import StarField from '../../theme/StarField';
import './Landing.css';

/**
 * The public entry point for ClubOps.
 *
 * The dashboard remains mounted beneath the lock screen so entering the
 * workspace feels like revealing one continuous surface rather than changing
 * pages. The data is intentionally local mock data until a dashboard
 * container and API layer are introduced.
 */
export default function LandingPage() {
  const { isAuthenticated, user, login, register } = useAuth();
  const { entered, enterDashboard } = useDashboardReveal(isAuthenticated);
  const [authDialog, setAuthDialog] = useState({ open: false, mode: 'signin' });

  const openAuthDialog = (mode) => setAuthDialog({ open: true, mode });
  const closeAuthDialog = () => setAuthDialog((current) => ({ ...current, open: false }));

  const handleAuthenticate = async (credentials) => {
    if (authDialog.mode === 'signup') {
      await register(credentials);
    } else {
      await login(credentials);
    }
    closeAuthDialog();
  };

  return (
    <div className="co-landing co-grain">
      <StarField />

      <div className={`co-landing__workspace ${entered ? 'is-entered' : ''}`}>
        <DashboardPreview data={dashboardPreviewData} user={user} />
      </div>
      <div className={`co-landing__scrim ${entered ? 'is-entered' : ''}`} />

      <LockScreen
        isAuthenticated={isAuthenticated}
        userName={user?.name}
        entered={entered}
        onSignIn={() => openAuthDialog('signin')}
        onCreateAccount={() => openAuthDialog('signup')}
        onEnter={enterDashboard}
      />

      <AuthDialog
        open={authDialog.open}
        mode={authDialog.mode}
        onModeChange={(mode) => setAuthDialog((current) => ({ ...current, mode }))}
        onClose={closeAuthDialog}
        onSubmit={handleAuthenticate}
      />
    </div>
  );
}
