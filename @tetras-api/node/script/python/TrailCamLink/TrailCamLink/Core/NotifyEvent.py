from TrailCamLink.Core.Event import Event

class NotifyEvent(Event): 
    def __init__(self, data: str): 
        super().__init__("NOTIFY_EVENT")
        self.data = data