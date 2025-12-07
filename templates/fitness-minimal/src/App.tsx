import { Routes, Route } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import Dashboard from '@/pages/Dashboard';
import Workouts from '@/pages/Workouts';
import Exercises from '@/pages/Exercises';
import Progress from '@/pages/Progress';
import Profile from '@/pages/Profile';

export default function App() {
  return (
    <div className="min-h-screen pb-20">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

