import { FlowControl } from '../config';
import StopAndWaitARQ from './StopAndWaitARQ';

export function getFlowController(type: FlowControl) {
  return {
    [FlowControl.STOP_AND_WAIT_ARQ]: StopAndWaitARQ,
    [FlowControl.GO_BACK_N_ARQ]: StopAndWaitARQ,
  }[type];
}
