Used for connecting image sensors to processors
MIPI = Mobile industry Processor Interface

Common MIPI standard
- CSI-2 (Camera)
- DSI (Display)
- I3C (Sensors)
- UniPro
- SoundWire

Camera Serial Interface 2nd generation

This is needed bc camera produces an enormous amounts of data.

1920 x 1080 at 30 FPS for 24-bit RGB = 1920 * 1080 * 30 * 24 = 1.49 Gbps

That is a lot.

CSI-2 runs on physical layer like MIPI D-PHY or MIPI C-PHY

D-PHY link consists of:
clock lane and 4 data lanes.
eg. 
```
clock +, clock  -, data0 +, data0 -, data1 +, data1 -
```

Each lane can pass 1.5 Gbps
it passes + and - instead of voltage amount

Advantage
- lower  EMI
- higher speed
- more noise resistant

- Packages are send with Packet data, Header, Payload, and CRC
- sensors output intensity levels: RAW10, RAW12, RGB888, YUV422, etc
- CSI-2 cable can carry multiple camera stream, not just one.