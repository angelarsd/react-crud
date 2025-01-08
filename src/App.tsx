import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerList from './components/DataList';
import CustomerForm from './components/DataForm';
import { SnackbarProvider } from './contexts/SnackbarContext';

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/add" element={<CustomerForm />} />
          <Route path="/edit/:id" element={<CustomerForm />} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
