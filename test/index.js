'use strict'

const test = require('tape')
const annotate = require('..')
const {scan} = annotate
const foo = require('./foo')

test('scan works', (t) => {
	const fields = scan(foo)
	t.deepEqual(Array.from(fields), [{
		// Foo: int32 a = 1
		keyPos: 0, keyLength: 1,
		fieldNr: 1, wireType: 0,
		dataPos: 1, dataLength: 2,
	}, {
		// Foo: repeated Bar b = 17
		keyPos: 3, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 6, dataLength: 4,
	}, {
		// Foo: repeated Bar b = 17
		keyPos: 10, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 13, dataLength: 4,
	}, {
		// Foo: repeated Bar b = 17
		keyPos: 17, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 20, dataLength: 4,
	}, {
		// Foo: string d = 2
		keyPos: 24, keyLength: 1,
		fieldNr: 2, wireType: 2,
		dataPos: 26, dataLength: 1,
	}])
	t.end()
})

test('scan works with a slice', (t) => {
	const fields = scan(foo, 6, 10)
	t.deepEqual(Array.from(fields), [{
		// Bar: string c = 3
		keyPos: 6, keyLength: 1,
		fieldNr: 3, wireType: 2,
		dataPos: 8, dataLength: 2,
	}])
	t.end()
})

test('annotate works', (t) => {
	const fields = annotate(foo)
	t.deepEqual(Array.from(fields), [{
		keyPos: 0, keyLength: 1,
		fieldNr: 1, wireType: 0,
		dataPos: 1, dataLength: 2,
	}, {
		keyPos: 3, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 6, dataLength: 4,
		nested: [{
			keyPos: 6, keyLength: 1,
			fieldNr: 3, wireType: 2,
			dataPos: 8, dataLength: 2,
		}],
	}, {
		keyPos: 10, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 13, dataLength: 4,
		nested: [{
			keyPos: 13, keyLength: 1,
			fieldNr: 3, wireType: 2,
			dataPos: 15, dataLength: 2,
		}],
	}, {
		keyPos: 17, keyLength: 2,
		fieldNr: 17, wireType: 2,
		dataPos: 20, dataLength: 4,
		nested: [{
			keyPos: 20, keyLength: 1,
			fieldNr: 3, wireType: 2,
			dataPos: 22, dataLength: 2,
		}],
	}, {
		keyPos: 24, keyLength: 1,
		fieldNr: 2, wireType: 2,
		dataPos: 26, dataLength: 1,
	}])
	t.end()
})
