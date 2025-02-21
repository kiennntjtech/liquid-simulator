export class Defer {
  private _resolve: any;
  private _reject: any;

  private _promise: Promise<any>;

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve = (value: any) => {
    this._resolve(value);
  };

  reject = (reason: any) => {
    this._reject(reason);
  };

  promise = () => {
    return this._promise;
  };
}
