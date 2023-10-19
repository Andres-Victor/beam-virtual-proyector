# Beam Projector Controller

Controla un proyector en tu ordenador desde tu teléfono móvil para situaciones especiales o reuniones de trabajo ¡Ese es el trabajo de BEAM!.  Esta aplicación se creó usando *NodeJS* y *ffmpeg (https://ffmpeg.org)* para leer metadatos y enumerar videos en sus respectivas carpetas. Se inician dos páginas: el control y el proyector (o pantalla). El control tiene acceso a los vídeos e imágenes disponibles en la carpeta `media`, mientras el proyector los muestra en pantalla.

## ¿Como funciona?

Siguiendo las instrucciones que se muestran mas adelante, usando una interfaz sencilla puedes elegir que videos o imagenes mostrar desde tu telefono, esas instrucciones se enviaran por medio de Socket.io a la computadora y mostrara la imagen o video que quieras.

## Instructions:

1. Inicia beam con beam.exe. Esto iniciara una ventana de comandos y si todo sale bien abrira en tu navegador favorito el proyector de Beam.
2. ¡Sube tus propios videos e imagenes!, haz click en la carpeta que aparece abajo a la derecha en la pagina del proyector *Beam Proyector* para que Node abra la carpeta Media, donde puedes arrastrar archivos multimedia. (Los archivos pueden estar ordenados en sus respectivas carpetas, Beam se encargara de leer las carpetas que esten dentro de media ¡AVISO! Beam no leerá las carpetas que esten dentro de otras carpetas)
3. Escanea el codigo QR de *Beam Proyector* con tu dispositivo movil para tener acceso a la pagina de los controles *Beam Controller*.
4. ¡Ya estas listo para mostrar videos e imagenes a tu preferencia!.

## ¿Y que hace Beam?

Beam, tal cual como un control remoto, te permite mostrar videos e imagenes en la pagina *Beam Proyector* como si de una pantalla se tratase, podras controlar los aspectos mas importantes de los videos como barra de tiempo, pausarlo o pasar al siguientet video/imagen, ademas podras mostrar el texto en pantalla como tu quieras.

## Interfaz atractiva y personalizable

Beam, es codigo abierto incluso en su versión compilada, la carpeta Public tiene todo el front end de beam, puedes cambiarlo o personalizarlo a tu gusto, por defecto la interfaz esta basada en spotify, asi que puedes estar seguro de que disfrutaras su uso

## More Information

Esta aplicación usa ffmpeg para obtener los covers de los videos (Por eso pesa mas de 200 mb) La app esta limitada a solo usar la lectura de metadatos en computadoras con Windows x64, si quieres puedes borrar ese limitador que esta desde la Linea 49 a la linea 67 de metadata.js y proporcionar tus propios recursos compatibles con windows x32 o linux. Uso un script de python compilado a .exe para obtener el titulo y el autor de los videos, puedes encontrar su codigo fuente en `resources/video_info/video_info.py`.


> Este es mi segundo proyecto serio en programación, si encuentras codigo ineficiente o malo directamente ¡Perdon! ＞︿＜