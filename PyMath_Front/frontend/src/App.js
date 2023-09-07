import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Reg/Reg';
import User from './pages/UserAdmin/Admin';
import Teacher from './pages/TeacherAdmin/Admin';
import AdminHome from './pages/Admin/Admin';
import Reset from './pages/ResestPassword/Reg';
import ReactLive2d from 'react-live2d';

//the click message of teh live2d model
const encouragementMessages2 = [
  "Keep going!",
  "Math is the language of the universe",
  "Python is a language of the future",
  "You're doing great!",
  "Believe in yourself!",
  "Never stop learning!",
  "You're making progress!",
  "Stay curious!",
  "Don't give up!",
  "You can do it!",
  "Practice makes perfect!",
  "Challenge your limits!"
];


function App() {
  const [dragging, setDragging] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [initialMousePosition, setInitialMousePosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // initial position
    const setInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 25,
        y: window.innerHeight - 40,
      });
    };

    // reset teh initial position when the windows resize
    const handleResize = () => {
      setInitialPosition();
    };

    setInitialPosition();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  //test move mouse down
  const handleMouseDown = (e) => {
    setMouseDown(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };
  
  //move the live2d model
  const handleMouseMove = (e) => {
    if (mouseDown) {
      setOffset({
        x: e.clientX - initialMousePosition.x,
        y: e.clientY - initialMousePosition.y,
      });
      setPosition({
        x: position.x + offset.x,
        y: position.y + offset.y,
      });
      setInitialMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    setDragging(false);
  };

   //resize the live2d model
  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      setScale((prevScale) => Math.min(prevScale + 0.1, 2));
    } else {
      setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));
    }
  };

  return (
    <div>
      <div
        style={{
          zIndex: 9999,
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `scale(${scale})`,
          cursor: dragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        <ReactLive2d
          width={250}
          height={400}
          ModelList={['Mark']}
          color="#C8E6FE"
          TouchDefault={encouragementMessages2}
          menuList={[]}
        />
      </div>
      {/* common path design */}
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/useradmin" component={User} />
          <Route path="/teacheradmin" component={Teacher} />
          <Route path="/admin" component={AdminHome} />
          <Route path="/reset" component={Reset} />
          <Redirect to="/login" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;