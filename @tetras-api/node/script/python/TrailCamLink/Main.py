import asyncio
import os

from TrailCamLink.Core.NotifyEvent import NotifyEvent
from TrailCamLink.TrailCamLink import TrailCamLink

def on_notify(e: NotifyEvent) -> None:
    name = e.data.split(" ")[0]
    print (f"Notify event : {name}")    

def download_medias(camera: TrailCamLink) -> None: 
    camera.set_camera_mode(TrailCamLink.CameraMode.STORAGE)

    numberOfJpg = camera.get_number_of_jpg()
    pages = int(numberOfJpg / 16)

    for i in range(0, pages):
        medias = camera.get_photos_list(i)
        for media in medias["fs"]: 
            print(f"Downloading {media['fid']}")
            camera.download_media(media["fid"], "imgs")


def download_medias_thumb(camera: TrailCamLink) -> None: 
    camera.set_camera_mode(TrailCamLink.CameraMode.STORAGE)

    numberOfJpg = camera.get_number_of_jpg()
    pages = int(numberOfJpg / 16)

    for i in range(0, pages):
        medias = camera.get_photos_list(i)
        for media in medias["fs"]: 
            print(f"Downloading {media['fid']}")
            camera.download_media_thumb(media["fid"], "imgs") 

async def connect_to_bluetooth(camera: TrailCamLink) -> None:
    print(f"Connecting to Trail Cam : {camera.get_mac_addr()}")

    while(not camera.is_connected()):
        try: await camera.connect_to_bluetooth()
        except: print(f"Connection failed")

    print("Connected")

async def disconnect_to_bluetooth(camera: TrailCamLink) -> None: 
    await camera.disconnect_to_bluetooth()

async def connect_to_wifi(camera: TrailCamLink) -> None:
    await camera.connect_to_wifi()

async def main() -> None:
    os.system("cls")

    camera = TrailCamLink("04:22:12:13:0f:27")
    camera.on_notify(on_notify)

    await connect_to_bluetooth(camera)
    await connect_to_wifi(camera)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()