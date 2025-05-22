
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OwnerPanel from './pages/OwnerPanel';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/owner" element={<OwnerPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
