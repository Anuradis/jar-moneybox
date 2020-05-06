import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IJar } from './jar-interface';

export class JarData implements InMemoryDbService {

  createDb() {
    const jars: IJar[] = [
      {
        id: 1,
        jarName: 'Sloik',
        accountBalance: 60,
        currency: 'PLN',
        payementHistory:
        [{
         timeStamp: '22/06/2020',
         title: 'for apples',
         value: 40
        }]
      }
    ];
    return {jars};
  }
}
