// main.js
// Modules to control application life and create native browser window
const {
  app, BrowserWindow, ipcMain, Notification, systemPreferences,
} = require('electron')
const path = require('path')
// const url = require('url')

// const mode = process.argv[2]

let loginWindow = null
let mainWindow = null

const browserObj = {
  loginBrowserUrl:'https://configure.otosaas.com/anon/login',
  mainBrowserUrl:'https://configure.otosaas.com/anon/home',
  // loginBrowserUrl:'http://localhost:3000/anon/login',
  // mainBrowserUrl:'http://localhost:3000/anon/home',
  loginBrowserParams:{
    width: 280,
    height: 400,
    // width: 560,
    // height: 800,
    fullscreen:false,
    fullscreenable:false,
    resizable:false,
    minimizable:false,
    titlestring:'ANON CHAT',
    icon: path.join(__dirname, './logo/anonChat.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  },
  mainBrowserParams:{
    width: 1006,
    height: 642,
    titlestring:'ANON CHAT',
    icon: path.join(__dirname, './logo/anonChat.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
    },
  },
}

const createWindow = (type, browserParams, devUrl) => {
  // Create the browser window.
  if (process.platform === 'darwin') {
    app.dock.setIcon(path.join(__dirname, './logo/anonChat.png'))
  }
  const mainWindows = {
    'login': () => {
      loginWindow = new BrowserWindow(browserParams)
      loginWindow.loadURL(devUrl)
    },
    'main': () => {
      mainWindow = new BrowserWindow(browserParams)
      mainWindow.loadURL(devUrl)
    },
  }
  // 判断是否是开发模式
  // if (mode === 'dev') {
  //   mainWindows[type]()
  // } else {
  //   // mainWindow.loadURL(url.format({
  //   //   pathname:path.join(__dirname, './build/index.html'),
  //   //   protocol:'file:',
  //   //   slashes:true,
  //   // }))
  // }
  mainWindows[type]()
  // loginWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  const {
    loginBrowserParams, loginBrowserUrl, mainBrowserParams, mainBrowserUrl,
  } = browserObj
  console.log(systemPreferences.getMediaAccessStatus('camera'), '----')
  if (systemPreferences.getMediaAccessStatus('camera') === 'granted') {
    createWindow('login', loginBrowserParams, loginBrowserUrl)
  } else {
    systemPreferences.askForMediaAccess('camera')
    createWindow('login', loginBrowserParams, loginBrowserUrl)
  }

  ipcMain.on('close', () => {
    console.log('close')
    loginWindow.close()
  })
  ipcMain.on('openMainWindow', () => createWindow('main', mainBrowserParams, mainBrowserUrl))
  ipcMain.on('notifications', (event, message) => {
    new Notification({ title: '消息通知', body: message, icon:path.join(__dirname, './logo/anonChat.png') }).show()
  })
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow('login', loginBrowserParams, loginBrowserUrl)
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。