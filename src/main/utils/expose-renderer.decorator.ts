import { ipcMain } from 'electron';

type Handler = (...args: any[]) => any;
export const EXPOSED_METADATA_KEY = Symbol('exposed');

interface ExposedMethod {
  eventName: string;
  handler: Handler;
}

export function ExposableToRenderer() {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      private ipcHandlers: ExposedMethod[] = [];

      private static initialized = false;

      constructor(...args: any[]) {
        super(...args);
        if (!this.constructor.initialized) {
          console.log('REGISTER HANDLER');
          this.scanExposedMethods(constructor.prototype);
          this.registerHandlers();
          this.constructor.initialized = true;
        }
      }

      private scanExposedMethods(prototype: any) {
        const propertyNames = Object.getOwnPropertyNames(prototype);
        const className = this.constructor.name || prototype.constructor.name;
        // eslint-disable-next-line no-restricted-syntax
        for (const propertyName of propertyNames) {
          const descriptor = Object.getOwnPropertyDescriptor(
            prototype,
            propertyName,
          );
          const exposedMetadata: string | undefined = Reflect.getMetadata(
            EXPOSED_METADATA_KEY,
            prototype,
            propertyName,
          );
          if (
            exposedMetadata === 'EXPOSED' &&
            descriptor &&
            typeof descriptor.value === 'function'
          ) {
            if (propertyName !== 'constructor') {
              console.log('handler added', `${className}:${propertyName}`);
              this.ipcHandlers.push({
                eventName: `${className}:${propertyName}`,
                handler: descriptor.value.bind(this),
              });
            }
          }
        }
      }

      private registerHandlers() {
        this.ipcHandlers.forEach(({ eventName, handler }) => {
          ipcMain.handle(eventName, async (event, ...args) => handler(...args));
        });
      }
    };
  };
}

export function exposedToRenderer() {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(
      EXPOSED_METADATA_KEY,
      'EXPOSED',
      target,
      propertyKey,
    );
  };
}
