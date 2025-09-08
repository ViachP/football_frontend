// // src/App.tsx
// import './App.css';
// import { AuthProvider, useAuth } from './contexts/AuthContext';
// import MatchList from './components/MatchList';
// import Login from './components/Auth/Login';
// import InfoButton from './components/InfoButton'; // Импортируем новую кнопку

// function AppContent() {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="loading">Checking authentication...</div>;
//   }

//   return (
//     <div className="App">
//       <main>
        
//         <MatchList />
        
//         <div style={{ 
//           position: 'fixed', 
//           top: '12px', 
//           right: '12px', 
//           zIndex: 1000,
//           display: 'flex',
//           flexDirection: 'column', // ← Меняем на колонку (вертикально)
//           gap: '10px', // Отступ между кнопками
//           width: '100px'
//         }}>

//           <Login /> {/* Верхняя кнопка */}
//           <InfoButton /> {/* Нижняя кнопка */}
//         </div>
//       </main>
//     </div>
//   );
// }

// function App() {
//   return (
//     <AuthProvider>
//       <AppContent />
//     </AuthProvider>
//   );
// }

// export default App;

import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MatchList from './components/MatchList';
import Login from './components/Auth/Login';
import InfoButton from './components/InfoButton';

function AppContent() {
  const {loading } = useAuth();
  
  // if (loading) {
  //   return (
  //     <div className="loading-container">
  //       <div className="loading-spinner"></div>
  //       <p>Загрузка...</p>
  //     </div>
  //   );
  // }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/screenshot_33.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
    );
  }

  return (
    <div className="App">
      <main>
        <MatchList />
        
        <div style={{ 
          position: 'fixed', 
          top: '12px', 
          right: '12px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: '100px'
        }}>
          <Login />
          <InfoButton />
        </div>
      </main>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;



