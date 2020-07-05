'use strict'

const {inspect} = require('util')

const render = (buf, ranges) => {
	let res = []

	let offset = 0
	for (const [length, items] of ranges) {
		res.push('') // empty line

		res.push([
			offset,
			buf.slice(offset, offset + length).toString('hex'),
		].join(' '))

		res.push(...items.map(it => inspect({
			wireType: it.wireType,
			fieldNr: it.fieldNr,
		}, {colors: true})))

		offset += length
	}

	return res.join('\n')
}

module.exports = render
