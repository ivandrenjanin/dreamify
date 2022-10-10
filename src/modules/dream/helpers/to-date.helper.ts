import { DateTime } from 'luxon';

export function toDate(value?: string): Date {
  if (!value) {
    return DateTime.now().toJSDate();
  }

  return DateTime.fromISO(value).toJSDate();
}
