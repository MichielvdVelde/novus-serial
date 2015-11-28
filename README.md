# novus-serial

This repo contains my code for my [Novus component](https://github.com/MichielvdVelde/novus-component), which I use as an interface between my Arduino sensor system and MQTT via my computer. The code is highly specific and might not be that interesting.

The Arduino board I built contains the following:
* A temperature and humidity sensor
* A sound threshold sensor (sends a signal on loud sounds)
* An LDR for estimating light conditions
* A 433mhz transmitter to switch remote wall sockets

This app does several things:

* Connect to my Arduino over USB serial (using [serialport](https://github.com/voodootikigod/node-serialport))
* Parse the responses from the sensors sent each minute (format is `TMP 19.4 HUM 55.8`)
* Send these values to different MQTT topics


* Subscribe to a commands topic (a command looks like `S 411` to `switch` group `3`, switch `1` to `1` (on))
* Relay any received commands to the Arduino

On the Arduino I run a sketch that I have placed [here](https://github.com/MichielvdVelde/novus-arduino-sketch).

Feel free to browse the source code :)

## License

Copyright 2015 Michiel van der Velde.

This software is licensed under [the MIT License](LICENSE).
