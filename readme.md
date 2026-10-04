
# ESP-Miner-Nerdaxe version

| Supported Targets | ESP32-S3              |
| ----------------- | --------------------- |
| Required Platform | >= ESP-IDF v5.3.X       |
| ----------------- | --------------------- |


# Modified Functions

- **Added Big Screen support** from [Cenron](https://github.com/cenron/ESP-Miner-NerdQAxePlus).

- **Added Web Portal password protection** to restrict access to the dashboard.

- **Added Wi-Fi MAC spoofing.**  
  This is useful for Wi-Fi networks that use captive portals and require authentication or payment before providing Internet access. For example, in some hostels or shared networks, the MAC address may be associated with an already-authenticated device. This feature allows the NerdQAxe++ to use a specified MAC address when connecting to such networks.

- **Updated the Wi-Fi Access Point (AP):**
  - Custom AP name
  - Hidden SSID
  - Password protection
  - AP remains available for local management

- **Restricted Web Portal access from the upstream Wi-Fi network.**  
  Users connected to the same external Wi-Fi network as the NerdQAxe++ cannot access the miner's management interface.

- **NerdQAxe++ management is available only through its own Access Point**, which is hidden and password protected.

---

This is a forked version of the NerdAxe miner, modified for use with the [NerdQAxe+](https://github.com/shufps/qaxe).

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
