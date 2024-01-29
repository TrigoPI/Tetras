import os

class ConsoleMenu:
    def show(menu: list) -> str:
        valid = False

        while (not valid):
            for index, item in enumerate(menu): print("{0} - {1}".format(index, item))

            value = input("> ")
            
            try:
                index = int(value)
                valid = True
                return menu[index]
            except:
                os.system("cls")