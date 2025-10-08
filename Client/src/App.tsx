import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import TicketList from './components/TicketList';
import TicketDetail from './components/TicketDetail';
import TicketForm from './components/TicketForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tickets" replace />} />
        <Route path="/tickets" element={<TicketList />} />
        <Route path="/tickets/new" element={<TicketForm />} />
        <Route path="/tickets/:id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;