'use strict'

const Pbf = require('pbf')
const {Foo} = require('./Foo.schema.js')

const pbf = new Pbf()
Foo.write({
	a: 1234,
	b: [{c: 'C1'}, {c: 'C2'}, {c: 'C3'}],
	d: 'D',
}, pbf)

module.exports = Buffer.from(pbf.finish())
