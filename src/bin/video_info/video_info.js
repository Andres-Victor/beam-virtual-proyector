const { spawn } = require('child_process');
const path = require('path');

  //Iniciar el servidor de extraccion de metadatos
let videoInfoPath = path.resolve(__dirname, 'video_info.exe');
let process = spawn(videoInfoPath);
let process_awake = true;

  //Id y callbacks
let nextId = 0;
let callbacks = {};

  //Al recibir datos del servidor, llama al callback correspondiente, si json falla en convertir los datos en un objeto, se considera un fallo del servidor
process.stdout.on('data', (data) => {
  try 
  {
    let object = JSON.parse(data.toString());
    if(global.dev_mode)console.log(`Video Metadata Catched: ${object.data.title}`);
    let callback = callbacks[object.id];
    if (callback) {
      callback(null, object.data);
      delete callbacks[object.id];
    }
  } 
  catch (error) 
  {
    console.error('Error, Video_Info catch invalid data: '+error);  
  }
  
});

  //Si la consola lanzó un error, muestralo en el sistema
process.stderr.on('data', (data) => {
  console.error(`Error: ${data.toString()}`);
});

  //Avisa cuando el servidor se cerró
process.on('close', (code) => {
  if (code !== 0) {
    console.error(`Error: Python script exited with code ${code}`);
  }
  process_awake = false;
});

module.exports = {
    //Le envia un comando al servidor de datos, en caso de estar caido el servidor, retorna instantaneamente un error
  async getVideoData(pathToVideo = String, callback = (err, data) => {}) {
    if(!process_awake) callback(err = 'Process Stopped', null);
    let id = nextId++;
    callbacks[id] = callback;
    process.stdin.write(`${pathToVideo}\n${id}\n`);
  },
};
