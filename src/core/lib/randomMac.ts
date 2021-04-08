export default function randomMac(): string {
  const hexDigits = '0123456789ABCDEF';
  let macAddress = '';

  for (let i = 0; i < 6; i++) {
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    if (i !== 5) macAddress += ':';
  }

  return macAddress;
}
