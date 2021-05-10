/**
 * setInterval() but calls the function immediately first
 * @param callback
 * @param timeout
 */
export default function setInterval_(
  callback: (...args: any[]) => void,
  timeout: number
) {
  const intervalId = setInterval(callback, timeout);
  // Why? If callback tries to clearInterval() in the first call itself,
  // it won't be able to because the returned interval id would be undefined.
  // So we enqueue call to callback to atleast *after* this function returns.
  setTimeout(callback);
  return intervalId;
}
