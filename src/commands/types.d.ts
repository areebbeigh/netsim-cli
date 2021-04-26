interface Arguments {
  [argName: string]: unknown;
  _: (string | number)[];
  $0: string;

  engine?: import('../core/engine').Engine;
  errorHandler?: (e: Error) => void;
  argParser?: (cmdString: string) => void;
}
