class NoFreeInterfaceError extends Error {
  name = 'NoFreeInterfaceError';
}

class AlreadyConnected extends Error {
  name = 'AlreadyConnected';
}

class InterfaceNotFound extends Error {
  name = 'InterfaceNotFound';
}

class NoAssignedIp extends Error {
  name = 'NoAssignedIp';
}

class InvalidIp extends Error {
  name = 'InvalidIp';
}

class EngineError extends Error {
  name = 'EngineError';
}

export {
  NoFreeInterfaceError,
  NoAssignedIp,
  InvalidIp,
  EngineError,
  AlreadyConnected,
  InterfaceNotFound,
};
