from typing import Callable
from bleak import BleakClient

class BLEClient: 
    def __init__(self, addr):
        self.addr = addr
        self.connected = False
        self.client = BleakClient(addr)

    def is_connected(self) -> bool: 
        return self.connected


    async def stop_notify(self, uuid: str) -> None:
        await self.client.stop_notify(uuid)

    async def start_notify(self, uuid: str, cb: Callable[[int, str], None]) -> None:
        await self.client.start_notify(uuid, cb)

    async def write_gatt(self, uuid: str, data: bytearray, response: bool = False) -> None:
        await self.client.write_gatt_char(uuid, data, response)

    async def read_gatt(self, uuid: str) -> str: 
        name_bytes = await self.client.read_gatt_char(uuid)
        name = bytearray.decode(name_bytes)
        return name

    async def get_services(self) -> list[tuple]: 
        services = []
        for service in self.client.services:
            services.append((service.handle, service.uuid, service.description, service.characteristics))
        return services

    async def connect(self) -> None:
        await self.client.connect()
        self.connected = True

    async def disconnect(self) -> None: 
        if (not self.is_connected()): return
        await self.client.disconnect()