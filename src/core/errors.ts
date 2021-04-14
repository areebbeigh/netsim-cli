class NoFreeInterfaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoFreeInterfaceError';
  }
}

class NoAssignedIp extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoAssignedIp';
  }
}

class InvalidIp extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidIp';
  }
}

export { NoFreeInterfaceError, NoAssignedIp, InvalidIp };
