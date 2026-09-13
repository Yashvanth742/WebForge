import React from 'react';
import {Routes, Routes} from 'react-router-dom';
import {AuthLayout, GuestLayout} from './pages/Layout';
import AuthPage from './pages/AuthPage';

const App = () => {
  return (
    <Routes> 
      {/* Login Routes*/}
      <Route element={<GuestLayout/>}>
      <Route path='/login' element={<AuthPage mode="login"/>}/>
        <Route path='/register' element={<AuthPage mode="register"/>}/>
    </Route>

    {/* Protected Routes*/}
      <Route element={<AuthLayout/>}>
      <Route path='/builder/:id' element={<BuilderPage />}/>
      <Route path='/preview/:id' element={<PreviewPage />}/>
    </Route>

    
    </Routes>

  );
}

export default App;