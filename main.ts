
let {BrowserWindow, app} = require('electron');
let win = null

app.on('ready', () => {

    win = new BrowserWindow({
        darkTheme: 'true'
    })
    win.setBounds(
        {
            x: 0,
            y: 0,
            width: 1500,
            height: 800,
            webPreferences: {
                nodeIntegration: true
            }
        }
    )

    win.loadFile('html/index.html')

})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
