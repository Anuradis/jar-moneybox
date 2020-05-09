import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IJar } from './jar-interface';
import { ITransfer } from '../transfer-history/transfer-interface';

export class JarData implements InMemoryDbService {

  createDb() {
    const jars: IJar[] = [
      {
        id: 1,
        jarName: '',
        accountBalance: Number.POSITIVE_INFINITY,
        currency: 'GBP'
      },
      {
        id: 2,
        jarName: 'Sloik',
        accountBalance: 600,
        currency: 'PLN'
      },
      {
        id: 3,
        jarName: 'Skarbonka',
        accountBalance: 600,
        currency: 'EUR'
      },
    ];
    const transfers: ITransfer[] = [
      {
        title: 'example',
        amount: 60,
        currency: 'PLN',
        from: '',
        to: '',
        id: 1,
        date: new Date()
      },
    ];
    const currencyOptions = [
      '', 'PLN', 'EUR', 'USD', 'GBP', 'CHF', 'JPY'
    ];
    return {transfers, jars, currencyOptions};
  }
}
