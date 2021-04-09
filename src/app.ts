import Host from './core/components/Host';
import Hub from './core/components/Hub';

const hub1 = new Hub(2, 'hub1');
const h1 = new Host('host1');

h1.connect(hub1);
console.log('here:', hub1, '\n', h1);
console.log(h1.interfaces[0].connection);
hub1.connect(h1);
