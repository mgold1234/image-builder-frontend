const CHROME_CONFIG_PORT = 8889;
const EDGE_FRONT_PORT = 8003;
const EDGE_APP_PATH = `${process.env.BETA ? '/beta' : ''}/apps/edge`;
const CONFIG_PATH = `${process.env.BETA ? '/beta' : ''}/config/chrome`;

module.exports = {
  routes: {
    [EDGE_APP_PATH]: { host: `http://127.0.0.1:${EDGE_FRONT_PORT}` },
    [CONFIG_PATH]: { host: `http://127.0.0.1:${CHROME_CONFIG_PORT}` },
  },
};
