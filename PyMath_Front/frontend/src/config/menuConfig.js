const menuList = [
  {
    title: 'Home', // 菜单标题名称
    key: '/home', // 对应的path
    icon: 'home', // 图标名称
    public: true, // 公开的
  },
  {
    title: 'Service Menu',
    key: '/menu',
    icon: 'appstore',
    public: true, 
  },

  {
    title: 'My service',
    key: '/record',
    icon: 'user'
  },
  {
    title: 'User information',
    key: '/user',
    icon: 'safety',
  },
  {
    title: 'History service',
    key: '/history',
    icon: 'safety',
  },
  {
    key:'/message',
    title: 'Messages'
  },
  {
    key:'/user/edit',
    title: 'Edit imformation'
  },
  {
    key:'/user/password',
    title: 'Change Password'
  }

]

export default menuList