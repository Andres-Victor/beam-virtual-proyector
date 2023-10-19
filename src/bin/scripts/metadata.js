//#region //REMOVING OLD THUMBNAILS
const fs = require('fs');
const path = require('path');
const fileManager = require('./fileManager');

async function emptyFolder(folderPath) {
    const currentMedia = await fileManager.fileRead('cache/lastMedia.cache');
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.log(`Error reading folder: ${err}`);
            return;
        }
        for (const file of files) {
            if(!isNaN(currentMedia)) return;
            let fileExist = currentMedia.find(media => {
                let filename = media.fileName;
                if(filename.includes('/'))
                    filename = filename.split('/')[1];
                filename = filename.split('.')[0];
                return file.replace('_thumbnail.jpg', '') === filename;
            })
            if(fileExist !== undefined)
            {
                continue;
            }
            const filePath = path.join(folderPath, file);
            fs.unlink(filePath, err => {
                if (err) {
                    console.log(`Error deleting file: ${err}`);
                }
            });
        }
    });
}
emptyFolder('./cache/thumbnails');
//#endregion

//#region //FFMPEG SETUP
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
//video Info
const { getVideoData } = require(path.join(__dirname,'../video_info/video_info'));
// Establece la ruta del ejecutable ffmpeg
const ffmpegPath = path.join(__dirname,'../ffmpeg/ffmpeg.exe');
ffmpeg.setFfmpegPath(ffmpegPath);

let ffmpegAvailable = true;

try 
{
    if (!fs.existsSync(ffmpegPath)) {
        throw new Error(`FFMPEG executable not found at ${ffmpegPath}`);
    }
} 
catch (e) 
{
    console.log(`Lectura de metadatos no disponible: ${e}`);
    ffmpegAvailable = false;
}

async function mediaItem(fileName, isVideo = true)
{
    let fileData = 
    {
        title: undefined,
        author: undefined,
        fileName:fileName,
        source: './media/'+fileName,
        thumbnail: undefined,
        video: isVideo,
        folderName: 'Inicio',
    }

    if(fileName.includes('/'))
    {
        fileData.folderName = fileName.split('/')[0];
        fileName = fileName.split('/')[1];
    }

    if(!ffmpegAvailable || !isVideo)
    {
        fileData.title = fileName.split('.')[0];
        fileData.thumbnail = isVideo ? '/src/no_image.jpg' : fileData.source;  
        return fileData;
    }
    await new Promise((resolve,reject)=>{
        let ready = 
        {
            data: false,
            thumbnail: false
        };
    
        getVideoData(fileData.source, function(err, videoData) {
            if (err) {
                console.log(`ERROR ON READING ${fileData.source}: ${err}`);
                ready.data = true;
            }
            else
            {
                fileData.title = videoData.title;

                    //Esta condicional es por un error en el script de python que por alguna razon obtiene datos extras ademas del titulo, asi que le aplico este filtro:
                    if(fileData.title.includes(' / '))
                    {
                        fileData.title = fileData.title.split(' / ')[1];
                    }


                fileData.author = videoData.author;

                    if(fileData.author.includes(' / '))
                    {
                        fileData.author = fileData.author.split(' / ')[1];
                    }

                ready.data = true;
            }
            if (ready.data && ready.thumbnail) {
                resolve();
            }
        });
    
        const thumbnailPath = './cache/thumbnails/'+fileName.split('.')[0]+'_thumbnail.jpg'
    
        ffmpeg(fileData.source)
        .outputOptions(['-map 0:v', '-map -0:V', '-c copy'])
        .output(thumbnailPath)
        .on('end', function() 
        {
            fileData.thumbnail = thumbnailPath;
            ready.thumbnail = true;
            if (ready.data && ready.thumbnail) {
                resolve();
            }
        })
        .on('error', function(err) 
        {    
            // Crea una imagen en miniatura del video basandose en el propio video
            
            ffmpeg(fileData.source)
            .outputOptions(['-vf thumbnail', '-frames:v 1'])
            .output(thumbnailPath)
            .on('end', function() 
            {
                fileData.thumbnail = thumbnailPath;
                ready.thumbnail = true;
                if (ready.data && ready.thumbnail) {
                    resolve();
                }
            })
            .on('error', function(err) {
                console.log(`Error creating Manual thumbnail of ${fileName} Aborting because: ${err.message}`);
                ready.thumbnail = true;
            })
            .run();
    
        })
        .run();
    
    });
    if(!fileData.title)
    {
        fileData.title = fileName.split('.')[0];
        fileData.author = '';
    }

    

    return fileData;
}

// mediaItem('test/lffv_S_545_r480P.mp4', true).then(res=>console.log(res));

module.exports = 
{
   mediaItem
}
