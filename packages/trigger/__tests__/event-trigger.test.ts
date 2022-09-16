'use strict';

const eventTrigger = require('..');
const assert = require('assert').strict;

assert.strictEqual(eventTrigger(), 'Hello from eventTrigger');
console.info("eventTrigger tests passed");
