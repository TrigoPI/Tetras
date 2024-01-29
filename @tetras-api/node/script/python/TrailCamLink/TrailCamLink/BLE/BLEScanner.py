from bleak import BleakScanner

class BLEScanner :
    async def find_by_name(self, name: str) -> dict | None:
        device = await BleakScanner.find_device_by_name(name)
        
        if (device == None): return None
        
        datas = device.__str__().split(": ")
        mac = datas[0]
        name = datas[1]

        return (mac, name)

    async def scan(self) -> list[dict]:
        devices = []
        scanResult = await BleakScanner.discover()
        
        for device in scanResult:
            datas = device.__str__().split(": ")
            mac = datas[0]
            name = datas[1]
            devices.append((mac, name))

        return devices