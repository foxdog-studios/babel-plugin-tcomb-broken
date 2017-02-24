// @flow
import type { FooType } from './FooType.js';

const echo = (foo: FooType) => console.log(foo);

echo('foo1');
echo('bar1');
