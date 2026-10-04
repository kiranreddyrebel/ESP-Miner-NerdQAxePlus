
# ESP-Miner-Nerdaxe version

| Supported Targets | ESP32-S3              |
| ----------------- | --------------------- |
| Required Platform | >= ESP-IDF v5.3.X       |
| ----------------- | --------------------- |


# Modified Functions

1. *Added Big Screen support from **"Cenron"** - https://github.com/cenron/ESP-Miner-NerdQAxePlus

- Added **Web portal password functionality**

- Added **Mac spoofing for WiFi**

  > Why I need this because some wifi's have captive portal it only allows internet after recharging through captive portal like in Hostels. So, replacing your Mac with someone who already had recharged will bypass that Captive portal and will get internet.

- **WiFi AP name changed + Hidden SSID + password protected** - so that no other people can access.

- **Removed access to other users connected to Wifi where Nerdqaxe++ is connected.** It will through reject connection.

- It can only be accessed through **NerdQaxe++ Access Point (hidden + password protected)**

---

This is a forked version from the **NerdAxe miner** that was modified for using on the [NerdQAxe+](https://github.com/shufps/qaxe).

Credits to the devs:
- BitAxe devs on OSMU: @skot/ESP-Miner, @ben and @jhonny
- NerdAxe dev @BitMaker


## How to build firmware

### Using Docker

Docker containers allow to use the toolchain without installing `esp-idf` or `Node 20.x` on the system.

#### 0. TL;DR - `esp-miner.bin`, `www.bin`

#### 1. First build the docker container

```bash
cd docker
./build_docker.sh

./docker/idf-shell.sh

# start idf-shell

./docker/idf-shell.sh

# set board
export BOARD="NERDQAXEPLUS2"

# set target and build the binaries
idf.py set-target esp32s3

idf.py build

# merge all partitions including config into a single binary
./merge_bin.sh nerdqaxe+.bin  -> to flash from 0x0

```
