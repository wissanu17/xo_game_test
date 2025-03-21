import { useState, useCallback, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import ReplayPage from './pages/ReplayPage';
import NotFoundPage from './pages/NotFoundPage';

// Simple router for our app
function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Add event listener for popstate (browser back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);

    // Custom event listener for navigation links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.hasAttribute('target') &&
        e.button === 0 && // left click
        !e.metaKey && !e.ctrlKey // not opening in new tab
      ) {
        e.preventDefault();
        const url = new URL(anchor.href);
        if (url.pathname !== currentPath) {
          window.history.pushState({}, '', url.pathname);
          setCurrentPath(url.pathname);
          // Scroll to top on page change
          window.scrollTo(0, 0);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      document.removeEventListener('click', handleClick);
    };
  }, [currentPath]);

  // Render the appropriate page based on the current path
  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/play':
        return <PlayPage />;
      case '/replays':
        return <ReplayPage />;
      default:
        // Simple 404 page
        return (
          <NotFoundPage />
        );
    }
  };

  return (
    <MainLayout>
      {renderPage()}
    </MainLayout>
  );
}

export default App;
