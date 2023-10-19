const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Crea la ventana del navegador.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.setMenu(null)

  // Carga el archivo HTML.
  win.loadURL('http://127.0.0.1:3200/proyector')
}

// Este método se llamará cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse solo después de que este evento ocurra.
app.whenReady().then(()=>
{
  const isConsole = process.argv.includes('--console');
  global.dev_mode = isConsole;
  createWindow();
})
global.appPath = app.getAppPath();
