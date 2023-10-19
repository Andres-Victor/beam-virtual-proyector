import json
import sys
from pymediainfo import MediaInfo

try:
    while True:
        ## Obtiene la direccion del archivo y la id del archivo en la siguiente linea
        pathToVideo = sys.stdin.readline().strip()
        id = sys.stdin.readline().strip()

        ## Si el archivo es invalido, rompe el while (Reutilizable para parar el sistema)
        if not pathToVideo:
            break

        ## Obtiene los metadatos del video
        media_info = MediaInfo.parse(pathToVideo)
        title = media_info.tracks[0].title
        author = media_info.tracks[0].performer

        ## Estructura la respuesta
        video_info = {
            'id': id,
            'data': {
                'title': title,
                'author': author
            }
        }

        ## Muestra la respuesta en la consola
        print(json.dumps(video_info))
        ## Envia la respuesta de la consola
        sys.stdout.flush()
except:
    print('Invalid file')
    sys.stdout.flush()
