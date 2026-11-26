import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    window.location.replace('/pages/login.html');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700 font-sans text-sm">
      Mengalihkan ke SIMAS Portal...
    </div>
  );
}
