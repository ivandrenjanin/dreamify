import { ConfigOption } from '../../../../enums/config-option.enum';

export class MissingConfigurationException extends Error {
  constructor(option: ConfigOption) {
    super(
      `Configuration option ${option} is not set. Check .env or environment variables.`,
    );
    /** Restore prototype chain. */
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
