export class Packer {
  format: string;
  size: number;
  endian: 'BE' | 'LE';
  ops: any;

  constructor(format: string) {
    this.format = format;
    this.size = 0;
    this.endian = 'BE';
    const endianMatch = /^(<|>|!)/.exec(format);
    if (endianMatch) {
      this.endian = endianMatch[0] === '<' ? 'LE' : 'BE';
      format = this.format = format.substring(1);
    }
    this.ops = {
      x: null,
      b: ['Int8', 1],
      B: ['Uint8', 1],
      h: ['Int16', 2],
      H: ['Uint16', 2],
      i: ['Int32', 4],
      I: ['Uint32', 4],
      l: ['Int32', 4],
      L: ['Uint32', 4],
      f: ['Float32', 4],
      d: ['Float64', 8],
      s: 'toString',
      p: 'toString',
    };
    let fmt = format;
    while (fmt.length > 0) {
      let num_length = 1;
      const num_match = /^[0-9]+/.exec(fmt);
      if (num_match) {
        num_length = parseInt(num_match[0]);
        fmt = fmt.substring(num_match[0].length);
      }
      const char = fmt[0];
      if (char === 's' || char === 'p' || char === 'x') {
        this.size += num_length;
      } else {
        this.size += this.ops[char][1] * num_length;
      }
      fmt = fmt.substring(1);
    }
  }

  unpack_from(buffer: Uint8Array, position = 0): (string | number)[] {
    const vals = [];
    let format = this.format;
    let offset = position;
    while (format.length > 0) {
      let times = 1;
      const num_match = /^[0-9]+/.exec(format);
      if (num_match) {
        times = parseInt(num_match[0]);
        format = format.substring(num_match[0].length);
      }
      const char = format[0];
      format = format.substring(1);
      if (char === 's' || char === 'p') {
        let str = '';
        for (let i = 0; i < times; i++) {
          str += String.fromCharCode(buffer[offset + i]);
        }
        vals.push(str);
        offset += times;
      } else if (char === 'x') {
        offset += times;
      } else {
        const op = this.ops[char];
        for (let i = 0; i < times; i++) {
          let val;
          if (op[0] === 'Int8') {
            val = (buffer[offset] << 24) >> 24;
          } else if (op[0] === 'Uint8') {
            val = buffer[offset];
          } else if (op[0] === 'Int16') {
            val =
              this.endian === 'LE'
                ? ((buffer[offset] | (buffer[offset + 1] << 8)) << 16) >> 16
                : (((buffer[offset] << 8) | buffer[offset + 1]) << 16) >> 16;
          } else if (op[0] === 'Uint16') {
            val =
              this.endian === 'LE'
                ? buffer[offset] | (buffer[offset + 1] << 8)
                : (buffer[offset] << 8) | buffer[offset + 1];
          } else if (op[0] === 'Int32') {
            val =
              this.endian === 'LE'
                ? buffer[offset] |
                  (buffer[offset + 1] << 8) |
                  (buffer[offset + 2] << 16) |
                  (buffer[offset + 3] << 24)
                : (buffer[offset] << 24) |
                  (buffer[offset + 1] << 16) |
                  (buffer[offset + 2] << 8) |
                  buffer[offset + 3];
          } else if (op[0] === 'Uint32') {
            val =
              this.endian === 'LE'
                ? buffer[offset] |
                  (buffer[offset + 1] << 8) |
                  (buffer[offset + 2] << 16) |
                  ((buffer[offset + 3] << 24) >>> 0)
                : ((buffer[offset] << 24) |
                    (buffer[offset + 1] << 16) |
                    (buffer[offset + 2] << 8) |
                    buffer[offset + 3]) >>>
                  0;
          } else {
            throw new Error('Unsupported op: ' + op[0]);
          }
          vals.push(val);
          offset += op[1];
        }
      }
    }

    return vals;
  }
}
