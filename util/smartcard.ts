const devices: Devices = new (require("smartcard").Devices)();

type DeviceEvents = {
  "device-activated": (event: { device: Device; devices: Device[] }) => void;
  "device-deactivated": (event: { device: Device; devices: Device[] }) => void;
  error: (device: Error) => void;
};
type CardEvents = {
  "card-inserted": (event: { device: Device; card: Card }) => void;
  "card-removed": (event: { name: string; card: Card }) => void;
};

type Devices = {
  on: <T extends keyof DeviceEvents>(key: T, fn: DeviceEvents[T]) => void;
  listDevices: () => Device[];
  lookup: (name: string) => Device;
};
type Device = {
  on: <T extends keyof CardEvents>(key: T, fn: CardEvents[T]) => void;
  getName: () => string;
  name: string;
};
type Card = {
  getAttr: () => string;
};

export { Devices, Device, Card };
export default devices;
