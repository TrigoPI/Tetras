import threading
import asyncio
import os

from ConsoleMenu import ConsoleMenu
from BLEScanner import BLEScanner
from BLEClient import BLEClient
from TrailLink import TrailLink

def notify_cb(handler, data) -> None:
    print("notification received")
    print(handler, data)

def clear() -> dict:
    os.system("cls")

async def global_scan() -> None:
    scanner = BLEScanner()
    print("starting ble scan...\n")
    devices = await scanner.scan()
    clear()

    for device in devices:
        print("     - name : {0}, mac : {1}".format(device[1], device[0]))
    
    print("")

async def find_by_name() -> None: 
    scanner = BLEScanner()
    name = input("name : ")

    clear()
    print("starting ble scan...\n")
    device = await scanner.find_by_name(name)
    clear()
    
    if (device == None): 
        print("Cannot find {0}\n".format(name))
        return
    
    print("     - name : {0}, mac : {1}\n".format(device[1], device[0]))

async def scan_services(client: BLEClient) -> None:
    services = await client.get_services()
    for service in services:
        print('\nservice', service[0], service[1], service[2])
        for char in service[3]: print('  characteristic', char.handle, char.uuid, char.description, char.properties)
        for desc in char.descriptors: print('    descriptor', desc)

async def read_gatt(client: BLEClient) -> None:
    uuid = input("uuid : ")
    try:
        print(await client.read_gatt(uuid))
    except:
        print("error")

async def start_notify(client: BLEClient) -> None:
    uuid = input("uuid : ")
    try: 
        await client.start_notify(uuid, notify_cb)
        while (1): await asyncio.sleep(10.0)
    except: 
        print("error")

async def stop_notify(client: BLEClient) -> None:
    uuid = input("uuid : ")
    try: await client.stop_notify(uuid)
    except: print("error")

async def write_gatt(client: BLEClient) -> None:
    uuid = input("uuid : ")
    data = input("data : ")

    b = bytearray()
    b.extend(map(ord, data))

    try: await client.write_gatt(uuid, b)
    except: print("error")

async def connect_to_device() -> None:
    mac = input("mac address : ")

    client = BLEClient(mac)

    maxAttempts = 10
    attempts = 0 
    connected = False

    print("Trying to connect to {0}".format(mac))

    while (attempts < maxAttempts and not connected):
        try:
            await client.connect()
            connected = True
            print("Connection to {0} success".format(mac))
        except:
            print("Cannot connect to : {0}".format(mac))
            attempts += 1

    if (attempts == maxAttempts):
        print("Connection failed with {0}".format(mac))
        return
    
    clear()

    mainMenu = ["services", "read", "write", "start notify", "stop notify", "quit"]
    current = mainMenu

    value = ""

    while (value != "quit"):
        value = ConsoleMenu.show(current)

        if (value == "services"):
            clear()
            await scan_services(client)

        if (value == "read"):
            clear()
            await read_gatt(client)

        if (value == "start notify"):
            clear()
            await start_notify(client)
        
        if (value == "stop notify"):
            clear()
            await stop_notify(client)

        if (value == "write"):
            clear()
            await write_gatt(client)

        if (value == "quit"):
            print("Disconnecting from {0}".format(mac))
            await client.disconnect()
            clear()
    

async def scanner() -> None: 
    mainMenu = ["scan", "connect"]
    current = mainMenu
    value = ""

    while (value != "quit"):
        value = ConsoleMenu.show(current)

        if (value == "scan"):
            clear()
            await global_scan()

        if (value == "connect"):
            clear()
            await connect_to_device()


loop = asyncio.get_event_loop()
loop.run_until_complete(scanner())
loop.close()

#write  : 0000ffe9-0000-1000-8000-00805f9b34fb
#notify : 0000ffe4-0000-1000-8000-00805f9b34fb

#start camera : BT_Key_On
#start camera : $OK$\r\n

#04:22:12:13:0f:27