import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IJar } from './jar-interface';
import { ITransfer } from '../transfer-history/transfer-interface';

export class JarData implements InMemoryDbService {

  createDb() {
    const jars: IJar[] = [
      {
        id: 1,
        jarName: 'PAY IN',
        accountBalance: Number.POSITIVE_INFINITY,
        currency: ''
      },
      {
        id: 2,
        jarName: 'pln',
        accountBalance: 600,
        currency: 'PLN'
      },
      {
        id: 3,
        jarName: 'eur',
        accountBalance: 600,
        currency: 'EUR'
      },
      {
        id: 4,
        jarName: 'pln1',
        accountBalance: 600,
        currency: 'PLN'
      },
      {
        id: 5,
        jarName: 'eur1',
        accountBalance: 600,
        currency: 'EUR'
      },
      {
        id: 6,
        jarName: 'eur2',
        accountBalance: 600,
        currency: 'EUR'
      },
    ];
    const transfers: ITransfer[] = [
      {
        title: 'aaaaa',
        amount: 10,
        currency: 'PLN',
        from: {
          id: 4, jarName: 'Zzww', accountBalance: 656, currency: 'EUR'
        },
        to: {
          id: 4, jarName: 'wwws', accountBalance: 656, currency: 'EUR'
        },
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
