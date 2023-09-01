import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Reg/Reg';
import User from './pages/UserAdmin/Admin';
import Teacher from './pages/TeacherAdmin/Admin';
import AdminHome from './pages/Admin/Admin';
import Reset from './pages/ResestPassword/Reg';
import ReactLive2d from 'react-live2d';


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
    // 设置初始位置
    const setInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 25,
        y: window.innerHeight - 40,
      });
    };

    // 当窗口大小改变时，更新位置
    const handleResize = () => {
      setInitialPosition();
    };

    // 设置初始位置并添加事件监听器
    setInitialPosition();
    window.addEventListener('resize', handleResize);

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleMouseDown = (e) => {
    setMouseDown(true);
    setInitialMousePosition({ x: e.clientX, y: e.clientY });
  };

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