import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/main-page/MainPage.jsx';
import { HomePage } from './pages/home-page/HomePage.jsx';

function App() {
  
  
  return (
    <Router>
      <Routes>
        <Route path={'/login-page'} element={<MainPage/>}/>
        <Route path={'/'} element={<HomePage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
