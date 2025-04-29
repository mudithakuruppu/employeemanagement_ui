
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { EmployeeList } from './components/EmployeeList';
import { EmployeeForm } from './components/EmployeeForm';
import { ReportGenerator } from './components/ReportGenerator';
export function App() {
  return <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/add" element={<EmployeeForm />} />
            <Route path="/edit/:id" element={<EmployeeForm />} />
            <Route path="/reports" element={<ReportGenerator />} />
          </Routes>
        </main>
      </div>
    </Router>;
}