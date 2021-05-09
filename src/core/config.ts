enum FlowControl {
  STOP_AND_WAIT_ARQ = 'stop_and_wait_arq',
  GO_BACK_N_ARQ = 'go_back_n_arq',
}

/**
 * A singleton for storing global configuration
 */
class Config {
  FLOW_CONTROL = FlowControl.STOP_AND_WAIT_ARQ;
  PACKET_RETRIES = 2;
}

const config = new Config();
export default config;
export { FlowControl };
