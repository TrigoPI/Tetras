import requests
import asyncio
import platform
import subprocess
import os

from wifi import Cell, Scheme
from typing import Callable

from TrailCamLink.BLE.BLEClient import BLEClient 
from TrailCamLink.Core.NotifyEvent import NotifyEvent

#TrailCam9B4A$123

class TrailCamLink:
    class CameraMode:
        SETUP         = "Setup"
        STORAGE       = "Storage"    
        VIDEO_CAPTURE = "VideoCapture"
        PHOTP_CAPTURE = "PhotoCapture"

    def __init__(self, mac: str):
        self.mode = TrailCamLink.CameraMode.SETUP
        self.mac = mac
        self.client = BLEClient(mac) 
        self.wifiOn = False
        self.cameraUrl = "http://192.168.1.8"
        self.key = "12345678"
        self.wifiSSID = "TrailCam9B4A$123"
        self.write  = "0000ffe9-0000-1000-8000-00805f9b34fb"
        self.notify = "0000ffe4-0000-1000-8000-00805f9b34fb"
        
        self.notifyHandler = None

    def get_mac_addr(self) -> str: 
        return self.mac

    def is_connected(self) -> bool:
        return self.client.is_connected()

    def get_number_of_jpg(self) -> int:
        if (self.mode != TrailCamLink.CameraMode.STORAGE): raise "Camera not in storage mode"
        response = requests.get(f"{self.cameraUrl}/Storage?GetDirFileInfo")
        json = response.json()
        return json["NumberOfJPG"]

    def on_notify(self, cb: Callable[[NotifyEvent], None]):
        self.notifyHandler = cb

    def set_camera_mode(self, mode: str) -> None:
        try : 
            response = requests.get(f"{self.cameraUrl}/SetMode?{mode}")
            json = response.json()
            if (json["Result"] == -1): raise "Error while changing camera mode" 
            self.mode = mode
        except :
            print("Error while changing camera mode")

    def get_photos_list(self, page: int = 0) -> dict:
        if (self.mode != TrailCamLink.CameraMode.STORAGE): raise "Camera not in storage mode"
        response = requests.get(f"{self.cameraUrl}/Storage?GetFilePage={page}&type=Photo")
        return response.json()

    def download_media_thumb(self, fid: str, outdir: str) -> None:
        if (self.mode != TrailCamLink.CameraMode.STORAGE): raise "Camera not in storage mode"
        response = requests.get(f"{self.cameraUrl}/Storage?GetFileThumb={fid}")
        if (len(response.content) == 0): raise f"Cannot find media {fid}"
        open(f"{outdir}/{fid}.jpg", "wb").write(response.content)

    def download_media(self, fid: str, outdir: str) -> None:
        if (self.mode != TrailCamLink.CameraMode.STORAGE): raise "Camera not in storage mode"
        response = requests.get(f"{self.cameraUrl}/Storage?Download={fid}")
        if (len(response.content) == 0): raise f"Cannot find media {fid}"
        open(f"{outdir}/{fid}.jpg", "wb").write(response.content)

    async def disconnect_to_bluetooth(self) -> None:
        if (not self.client.is_connected()): return
        await self.client.disconnect()

    async def connect_to_bluetooth(self) -> None:
        await self.client.connect()
        await self.client.start_notify(self.notify, self.__notify_callback)
        await self.__write_BT_Key_On()
        while (not self.wifiOn): await asyncio.sleep(10.0)

    async def connect_to_wifi(self) -> None:
        connected = False

        while (not connected):
            if (platform.system().lower() == "windows"): self._connect_wifi_windows()
            else: self._connect_wifi_linux()
            
            await asyncio.sleep(3.0)
            connected = self.__ping_camera()
        
        print("Connected")

    async def __notify_callback(self, _,  data: bytearray) -> None:
        valueHex = data.hex()
        ssid = "53534944"
        pswe = "50535745"
        apok = "41504f4b"
        
        dataRaw = str(data)
        dataRaw = dataRaw.replace("bytearray(b'", "")
        dataRaw = dataRaw.replace('bytearray(b"', "")
        dataRaw = dataRaw.replace("')", "")
        dataRaw = dataRaw.replace('")', "")

        if (self.notifyHandler != None):
            event = NotifyEvent(dataRaw)
            self.notifyHandler(event)

        if (ssid in valueHex):
            await self.__write_ok()

        if (pswe in valueHex):
            await self.__write_ok(True)
            await self.__write_device_id("1234")
        
        if (apok in valueHex):
            await self.__write_ok()
            self.wifiOn = True

    def __ping_camera(self) -> bool:
        param = "-n" if platform.system().lower() == "windows" else "-c"
        command = ["ping", param, "1", "192.168.1.8"]
        return subprocess.call(command) == 0

    def _connect_wifi_windows(self) -> None:
        os.system(f'netsh wlan connect name="{self.wifiSSID}" ssid="{self.wifiSSID}" interface=Wi-Fi')

    def _connect_wifi_linux(self) -> None:
        scheme = Scheme.find('wlan0', self.wifiSSID)

        if (scheme == None):
            cell = list(Cell.all('wlan0'))[0]
            scheme = Scheme.for_cell('wlan0', self.wifiSSID, cell, self.key)
            scheme.save()
        
        scheme.activate()

    async def __write_device_id(self, id: str) -> None:
        deviceId = bytearray()
        deviceId.extend((map(ord, "ID${0}\r\n".format(id))))
        await self.client.write_gatt(self.write, deviceId)

    async def __write_BT_Key_On(self) -> None:
        btKeyOn = bytearray()
        btKeyOn.extend(map(ord, "BT_Key_On"))
        await self.client.write_gatt(self.write, btKeyOn)

    async def __write_ok(self, response=False) -> None:
        ok = bytearray()
        ok.extend(map(ord, "$OK$\r\n"))
        await self.client.write_gatt(self.write, ok, response)