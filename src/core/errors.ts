class NoFreeInterfaceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoFreeInterfaceError';
  }
}

export { NoFreeInterfaceError };
