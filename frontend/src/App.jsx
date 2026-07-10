import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing/Landing';
import './theme/tokens.css';

// Routing (react-router) lands in Roadmap #3 alongside AppLayout.
// Landing is the only screen for now — it already knows how to render
// both guest and authenticated states via AuthContext.
function App() {
  return (
    <AuthProvider>
      <Landing />
    </AuthProvider>
  );
}

export default App;
