import os from 'os';

function getLocalIpAndDataOs() {
    const interfaces = os.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
          return alias.address;
        }
      }
    }
    return '0.0.0.0';
  }

  export default getLocalIpAndDataOs