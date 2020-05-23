import { AbstractControl } from '@angular/forms';

export function currencyValidator(control: AbstractControl): { [key: string]: boolean | null } {
  const from = control.get('from');
  if (from.status !== null && from.status !== undefined) {
    return from.disabled ? { currencyValidator: true } : null;
  }
}
