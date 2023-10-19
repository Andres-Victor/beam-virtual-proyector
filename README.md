# Beam Projector Controller

Beam Projector Controller allows you to control a projector on your computer from your mobile phone for special situations or work meetings. This application was created using *NodeJS* and *ffmpeg(https://ffmpeg.org)* to read metadata and list videos in their respective folders. Two pages are initiated: the control and the projector (or screen). The control has access to the videos and images available in the media folder, while the projector displays them on the screen.

## How does it work?

Following the instructions shown below, using a simple interface, you can choose which videos or images to display from your phone. These instructions will be sent via Socket.io to the computer and it will display the image or video you want.

## Instructions:

1. Start Beam with beam.exe. This will start a command window and if everything goes well, it will open the *Beam Projector* in your favorite browser.
2. Upload your own videos and images! Click on the folder that appears at the bottom right of the Beam Projector page to open the Media folder, where you can drag multimedia files. (The files can be sorted into their respective folders, Beam will read the folders that are inside media. WARNING! Beam will not read folders that are inside other folders)
3. Scan the QR code of *Beam Projector* with your mobile device to access the *Beam Controller* page.
4. You are now ready to display videos and images to your preference!

## What does Beam do?

Beam, just like a remote control, allows you to display videos and images on the *Beam Projector* page as if it were a screen. You can control the most important aspects of the videos such as the time bar, pause it or move to the next video/image, and you can also display text on the screen as you wish.

## Attractive and customizable interface

Beam is open source even in its compiled version, the Public folder has all the front end of Beam, you can change or customize it to your liking. By default, the interface is based on Spotify, so you can be sure you will enjoy using it.

## More Information

This application uses ffmpeg to obtain the covers of the videos (that's why it weighs more than 200 MB). The app is limited to using metadata reading on x64 Windows computers, but you can delete that limiter that is from Line 49 to Line 67 of metadata.js and provide your own resources compatible with x32 Windows or Linux. I use a compiled python script to get the title and author of the videos, you can find its source code in `resources/video_info/video_info.py`. 

> This is my second serious programming project, if you find inefficient or bad code directly, I apologize! ＞︿＜