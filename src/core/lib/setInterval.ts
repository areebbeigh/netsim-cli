/**
 * setInterval() but calls the function immediately first
 * @param callback
 * @param timeout
 */
export default function setInterval_(
  callback: (...args: any[]) => void,
  timeout: number
) {
  callback();
  return setInterval(callback, timeout);
}
