import struct
import zlib

# Generate a minimal valid PNG (280x160, grey with a lighter center rectangle)
w, h = 280, 160
raw = bytearray()
for y in range(h):
    raw.append(0)  # filter type: None
    for x in range(w):
        # Outer: dark grey (#3b3b47), inner rectangle: lighter grey
        if 20 <= x < 260 and 20 <= y < 140:
            raw.extend([0x4a, 0x4a, 0x5a])  # inner fill
        else:
            raw.extend([0x2b, 0x2b, 0x35])  # outer fill

raw = bytes(raw)
c = zlib.compress(raw)

def chunk(tag, data):
    length = struct.pack('>I', len(data))
    crc = struct.pack('>I', (zlib.crc32(tag + data) + 0xffffffff) & 0xffffffff)
    return length + tag + data + crc

png = b'\x89PNG\r\n\x1a\n'
png += chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
png += chunk(b'IDAT', c)
png += chunk(b'IEND', b'')

with open('docs/images/screenshot-home.png', 'wb') as f:
    f.write(png)

print('OK')
