# Packet format
    The packages are composed by the header, the payload, the checksum, and an ending byte;
## Header
    0xfb, 0xbf
    
    [0xfb, 0xbf]

## Payload
    packet length, 1 byte command, ...n bytes params

    [0x07, 0x0B, 0x00, 0x00]

## Packet end
    checksum + 0xed

    The checksum is the sum of all the bytes of the packet.length + payload

    [0x9a, 0xed]

## Full package example

[0xfb, 0xbf, 0x07, 0x0b, 0x00, 0x00, 0x0b, 0xed]

# Commands

## Controlling wheels
Command 07

### one servo
params 0x01 [motor 1 byte][direction 1 byte][velocity 2 bytes]

mode 1 control one servo
direction 1-2
velocity 16 bits

                        cmd   mode    s     d     v1    v2
const payload  = [0x0A, 0x07, 0x01, 0x01, 0x02, 0x01, 120];

> remember that the servos are inverted so if you send a command to the 2 wheels servos they will run in opposite direction

## Controlling servo position

const payload = [
    0x09,
    0,
    0,
    0,
    28,
    205, // motor central
    80,  // brazo izquierdo
    130, // brazo derecho
    30,  // velocidad
    1,   // ?
    121  // ?
];

## Control eyes colors

### all lights
const payload = [
    0x79,
    0x04,
    0x03, // eyes 1, 2, 3 both
    0x0A, // time
    0x01, // number of colors
    0xFF, // light mask
    0x35, // color
    0x35, // color
    0x35  // color
]

### custom colors each light
const payload = [
    0x79,
    0x04,
    0x03, // eyes
    0xFF, // time
    0x05, // number of colors
    0x11, // light mask
    0xFF, // color
    0xF0, // color
    0x00, // color
    0x0A, // light mask
    0xFF, // color
    0x80, // color
    0x00, // color
    0x04, // light mask
    0xFF, // color
    0x00, // color
    0x00, // color
    0xA0, // light mask
    0x00, // color
    0xFF, // color
    0xFF, // color
    0x40, // light mask
    0x35, // color
    0x35, // color
    0x35, // color
]

### animation eyes

const payload = [
    0x78, // command
    0x04,
    0x03, // eye 1, 2, 3 both
    0x02, // animation
    0x00, // repetition 16bits?
    0x01, // repetitions
    0x40, // RR
    0x40, // GG
    0xFF  // BB
]

### IR sensor status request
const payload = [
    0x08,
    0x7E,
    0x01,
    0x01,
    0x01
]
// read response
characteristics[1].on('data', function (data, isNotification) {
    console.log(data)
    console.log('NOTIFICATION', data.readInt32BE(10));
});

### read positions
070B 0000
070B 0001

// read response
characteristics[1].on('data', function (data, isNotification) {
    // last payload byte is the position of the servo (one response by servo)
    console.log(data)
});
