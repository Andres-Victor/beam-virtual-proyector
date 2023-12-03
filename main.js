//#region MEDIA FOLDER 
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const mediaFolder = path.join(process.cwd(), 'media');
const cacheFolder = path.join(process.cwd(), 'cache');

// Verifica si las carpetas media y cache existen
if (!fs.existsSync(mediaFolder)) 
{
  // Si no existe media, la crea, crea la carpeta
  fs.mkdirSync(mediaFolder);
}
if(!fs.existsSync(cacheFolder))
{
  // Si no existe cache lo crea junto a thumbnails
  fs.mkdirSync(cacheFolder)
  fs.mkdirSync(path.join(cacheFolder, 'thumbnails'));
}
//#endregion

//#region IP
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIP;

for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
            localIP = net.address;
            break;
        }
    }
}
//#endregion

//#region Server
const express = require('express');
const app = express();
      app.engine('html', require('ejs').renderFile);
      app.set('view engine', 'html');
      const router = express.Router();
const server = require('http').createServer(app);
const port = 32005;

app.use(express.static(path.join(__dirname,'./src/public')));
app.use('/media', express.static(mediaFolder));
app.use('/cache', express.static(cacheFolder));


router.get('/control',function(req,res){
  res.render(path.join(__dirname+'/src/public/controller.html'));
});

router.get('/proyector', function(req, res) {
  res.render(path.join(__dirname+'/src/public/proyector.html'), {direction: `http://${localIP}:${port}/`});
});

app.use('/', router);

//#endregion
//#region General Functions
  global.multiExec = function multiExec(win, lin, mac)
  {
    try
    {
      switch (require('os').platform()) {
        // Para Windows
          case 'win32':exec(win);
          break;
        // Para macOS
          case 'darwin':exec(mac);
          break;
        // Para Linux
          case 'linux':exec(lin);
          break;
        default:console.log('No se puede ejecutar el comando: SO Incompatible')
        break;
      }
    }
    catch(e)
    {
      console.log('multiExec Error: '+e)
    }
  }
//#endregion

const fileManager = require(path.join(__dirname,'./src/bin/scripts/fileManager'));
const io = require('socket.io')(server);
const metadata = require(path.join(__dirname,'./src/bin/scripts/metadata'));

let currentMedia = [];

fileManager.fileRead('cache/lastMedia.cache').then(content =>{if(isNaN(content)){currentMedia = content}})

let sockets = [];

let alreday_loading_media = false;

async function readFiles()
{
  if(alreday_loading_media) return;

  alreday_loading_media = true;
  let startTime = Date.now();
  // Lee el contenido de la carpeta
  const files = fs.readdirSync(mediaFolder);

  let insideFolder = [];

  // Filtra los archivos de video e imagen
  let mediaFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    if(ext === '' && file !== 'thumbnails')
    {
      //Es una carpeta
      insideFolder.push(file);
    }
    return ['.mp4', '.mov', '.jpg', '.jpeg', '.png'].includes(ext);
  });

  insideFolder.forEach(folder => {
    const insideFiles = fs.readdirSync(mediaFolder+'/'+folder);
    insideFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.mp4', '.mov', '.jpg', '.jpeg', '.png'].includes(ext);
    }).forEach(file => {
      mediaFiles.push(folder+'/'+file);
    });
  });

  let currentMediaLenght = currentMedia.length;
  
  currentMedia = currentMedia.filter(currentfile => {
    return mediaFiles.some(file => file === currentfile.fileName);
  });

  let unsavedFiles = mediaFiles.filter(file => {
    return !currentMedia.some(savedFile => savedFile.fileName === file);
  });
  // Separa los archivos de video e imagen
  const videos = unsavedFiles.filter(file => ['.mp4', '.mov'].includes(path.extname(file).toLowerCase()));
  const images = unsavedFiles.filter(file => ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase()));
  
  let media = [];
  if (images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      media.push(await metadata.mediaItem(image, false))
    }
  }
  if (videos.length > 0) {
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      media.push(await metadata.mediaItem(video, true))
    }
  }
  
  let mediaLenght = media.length;
  media = media.concat(currentMedia);
  currentMedia = media;

  for (const socket of sockets) {
    socket ? socket.emit('catchMedia', media) : null;
  }
  
  //Actualiza el cache si la longitud de los archivos actuales cambió o si se encontraron archivos nuevos
  mediaLenght > 0 || currentMediaLenght !== currentMedia.length? fileManager.fileWrite('cache/lastMedia.cache', currentMedia) : null

  console.log(`Media set in ${Date.now() - startTime} miliseconds`)
  alreday_loading_media = false;
}

io.on('connection', (socket) => {
  sockets.push(socket);

  // socket.emit('serverData', 'http://'+localIP+':'+port);
  
  socket.on('getMediaFiles', async () => {
    await readFiles();
  });

  socket.on('sendText', text=>{
    sockets.forEach(sock => {
      sock.emit('sendText', text);
    });
  });

  socket.on('proyectorStatus', status =>{
    sockets.forEach(sock => {
      sock.emit('proyectorStatus', status);
    });
  });

  socket.on('proyectorStatusRequest', () =>{
    sockets.forEach(sock => {
      sock.emit('proyectorStatusRequest');
    });
  });

  socket.on('videoTime', ammount =>{
    sockets.forEach(sock => {
      sock.emit('videoTime', ammount);
    });
  });

  socket.on('playMedia', (toPlay) =>{
    sockets.forEach(sock => {
      sock.emit('playMedia', toPlay);
    });
  });

  socket.on('trigger_tool', (toolname, args=arguments)=>{
    sockets.forEach(sock => {
      sock.emit('trigger_tool', toolname, args);
    });
  })
  socket.on('stop_tool', ()=>{
    sockets.forEach(sock => {
      sock.emit('stop_tool');
    });
  })

  socket.on('togglePause', () =>{
    sockets.forEach(sock => {
      sock.emit('togglePause');
    });
  });

  socket.on('openFolder', ()=>{
    try 
    {
      console.log('Abriendo carpeta de archivos ubicada en '+mediaFolder)
      global.multiExec(`start "" "${mediaFolder}"`,`xdg-open "${mediaFolder}"`,`open "${mediaFolder}"`)

    } 
    catch (error) 
    {
      console.log('Error al abrir la carpeta media, razon: '+error);
    }
  });

});

const allReadyMessage = `
Beam Started on next direction: ${localIP}:${port}
`

server.listen(port, () => {
  console.log(allReadyMessage);
    try 
    {
      require(path.join(__dirname,'./src/bin/scripts/electron'))
    } 
    catch (error) 
    {
      console.log('No se puede abrir el proyector , razon: '+error);
    }
});
