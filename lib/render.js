'use strict'

const Pbf = require('pbf')
const chalk = require('chalk')
const {inspect} = require('util')

// https://developers.google.com/protocol-buffers/docs/encoding#structure
const wireTypes = []
wireTypes[Pbf.Varint] = 'int32/int64/uint32/uint64/sint32/sint64/bool/enum'
wireTypes[Pbf.Fixed64] = 'fixed64/sfixed64/double'
wireTypes[Pbf.Bytes] = 'string/bytes/embedded message/packed repeated field'
wireTypes[Pbf.Fixed32] = 'fixed32/sfixed32/float'

const asHex = (buf) => {
	let res = ''
	for (let i = 0; i < buf.length; i++) {
		res += ('0' + buf[i].toString(16)).slice(-2) + ' '
	}
	return res.slice(0, -1)
}

const renderField = (field, buf, indent = '') => {
	const {
		keyPos, keyLength,
		fieldNr, wireType,
		dataPos, dataLength,
	} = field
	let res = ''

	const keyBuf = buf.slice(keyPos, keyPos + keyLength)
	res += [
		indent,
		chalk.yellow('#' + fieldNr),
		' ',
		wireTypes[wireType] || '?',
	].join('') + '\n'

	if (field.nested) {
		for (const nested of field.nested) {
			res += renderField(nested, buf, indent + '\t')
		}
	} else {
		const dataBuf = buf.slice(dataPos, dataPos + dataLength)
		res += [
			indent,
			'  ', chalk.cyan(asHex(dataBuf)),
		].join('') + '\n'
	}

	return res
}

const render = (buf, fields) => {
	let res = ''
	for (const field of fields) {
		res += renderField(field, buf)
	}
	return res
}

module.exports = render
