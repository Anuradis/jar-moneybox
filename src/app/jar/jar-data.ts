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
        jarName: 'aaaxx',
        accountBalance: 600,
        currency: 'PLN'
      },
      {
        id: 3,
        jarName: 'aaacccxx',
        accountBalance: 600,
        currency: 'EUR'
      },
      {
        id: 4,
        jarName: 'Zzww',
        accountBalance: 600,
        currency: 'EUR'
      },
      {
        id: 5,
        jarName: 'taa',
        accountBalance: 600,
        currency: 'EUR'
      },
    ];
    const transfers: ITransfer[] = [
      {
        title: 'aaaaa',
        amount: 10,
        currency: 'USD',
        from: {
          id: 4, jarName: 'Zzww', accountBalance: 656, currency: 'EUR'
        },
        to: {
          id: 4, jarName: 'wwws', accountBalance: 656, currency: 'EUR'
        },
        id: 1,
        date: new Date()
      },
      // {
      //   title: 'aaaaabb',
      //   amount: 20,
      //   currency: 'JPY',
      //   from: 'aaaxx',
      //   to: 'dcaaaa',
      //   id: 4,
      //   date: new Date()
      // },
      // {
      //   title: 'aaaxxx',
      //   amount: 30,
      //   currency: 'PLN',
      //   from: 'Zzww',
      //   to: 'Zzww',
      //   id: 3,
      //   date: new Date()
      // },
      // {
      //   title: 'aaaccc',
      //   amount: 40,
      //   currency: 'CHF',
      //   from: 'aaaxx',
      //   to: 'dcaaaa',
      //   id: 5,
      //   date: new Date()
      // },

    ];
    const currencyOptions = [
      '', 'PLN', 'EUR', 'USD', 'GBP', 'CHF', 'JPY'
    ];
    const currencyOptions1 = [
      {value: "''"},
      {value: "EUR"},
      {value: "USD"},
      {value: 'GBP'},
      {value: "CHF"},
      {value: "JPY"},
      {value: "PLN"}
    ]
    return {transfers, jars, currencyOptions};
  }
}
