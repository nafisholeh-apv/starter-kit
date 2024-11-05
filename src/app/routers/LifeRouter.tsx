import { Routes, Route } from 'react-router-dom';
import LifeDetailPage from '../pages/public/LifeDetailPage';
import LivesPage from '../pages/public/LivesListPage';

const LifeRouter = () => (
    <Routes>
        <Route element={<LivesPage />} path="" />
        <Route element={<LifeDetailPage />} path="/:id" />
    </Routes>
);

export default LifeRouter;
