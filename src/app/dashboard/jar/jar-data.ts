import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IJar } from './jar-interface';
import { ITransfer } from '../transfer-history/transfer-interface';

export class JarData implements InMemoryDbService {

  createDb() {
    const jars: IJar[] = [
      {
        id: 1,
        jarName: 'ExampleAcc',
        accountBalance: 600,
        currency: 'EUR'
      },
      {
        id: 2,
        jarName: 'Saving Box',
        accountBalance: 100000,
        currency: 'EUR'


      },
      {
        id: 3,
        jarName: 'Jar',
        accountBalance: 400,
        currency: 'EUR'
      },
    ];
    const transfers: ITransfer[] = [
      {
        title: 'ExampleAcc',
        amount: 10,
        currency: 'PLN',
        from: {
          id: 4, jarName: 'Jar', accountBalance: 656, currency: 'EUR'
        },
        to: {
          id: 4, jarName: 'Saving Box', accountBalance: 656, currency: 'EUR'
        },
        id: 1,
        date: new Date()
      },
    ];
    const currencyOptions = [
       'PLN', 'EUR', 'USD', 'GBP', 'CHF', 'JPY'
    ];
    return {transfers, jars, currencyOptions};
  }
}
