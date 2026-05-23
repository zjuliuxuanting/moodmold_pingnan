import { Routes, Route, Outlet } from 'react-router-dom'
import PhoneFrame from './components/PhoneFrame'
import IntroPage from './pages/IntroPage'
import HomePage from './pages/HomePage'
import StayPage from './pages/StayPage'
import BookPage from './pages/BookPage'
import PassPage from './pages/PassPage'
import DiaryListPage from './pages/DiaryListPage'
import DiaryDetailPage from './pages/DiaryDetailPage'
import CollectionPage from './pages/CollectionPage'
import CardPage from './pages/CardPage'
import BindPage from './pages/BindPage'
import PetPage from './pages/PetPage'
import HostPage from './pages/HostPage'
import HostPetsPage from './pages/HostPetsPage'
import HostCheckinPage from './pages/HostCheckinPage'
import HostSubmittedPage from './pages/HostSubmittedPage'
import HostUpdatePage from './pages/HostUpdatePage'
import HostMonthPage from './pages/HostMonthPage'
import HostRegisterPage from './pages/HostRegisterPage'
import CheckinPage from './pages/CheckinPage'
import QrPage from './pages/QrPage'

function PhoneLayout() {
  return (
    <PhoneFrame>
      <Outlet />
    </PhoneFrame>
  )
}

function App() {
  return (
    <Routes>
      {/* 产品介绍页 — 不套手机壳 */}
      <Route path="/" element={<IntroPage />} />

      {/* 所有 H5 页面都套 PhoneFrame */}
      <Route element={<PhoneLayout />}>
        <Route path="/booking" element={<HomePage />} />
        <Route path="/stay" element={<StayPage />} />
        <Route path="/book/:innId" element={<BookPage />} />
        <Route path="/pass/:tagId" element={<PassPage />} />
        <Route path="/diary/:tagId" element={<DiaryListPage />} />
        <Route path="/diary/:tagId/:dayId" element={<DiaryDetailPage />} />
        <Route path="/collection/:tagId" element={<CollectionPage />} />
        <Route path="/card/:tagId" element={<CardPage />} />
        <Route path="/bind/:tagId" element={<BindPage />} />
        <Route path="/pet/:tagId" element={<PetPage />} />
        <Route path="/host" element={<HostPage />} />
        <Route path="/host/pets" element={<HostPetsPage />} />
        <Route path="/host/register" element={<HostRegisterPage />} />
        <Route path="/host/checkin/:petId" element={<HostCheckinPage />} />
        <Route path="/host/submitted/:petId" element={<HostSubmittedPage />} />
        <Route path="/host/update/:petId" element={<HostUpdatePage />} />
        <Route path="/host/month" element={<HostMonthPage />} />
        <Route path="/checkin/:tagId" element={<CheckinPage />} />
        <Route path="/qr" element={<QrPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  )
}

export default App
