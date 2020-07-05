'use strict'

const Pbf = require('pbf')
const flattenRanges = require('flatten-overlapping-ranges')

const scan = function* (buf, offset = 0, end = buf.length) {
	const pbf = new Pbf(buf)
	pbf.pos = offset
	pbf.length = end
	while (pbf.pos < pbf.length) {
		// https://github.com/mapbox/pbf/blob/89ed77309c7c646b809251b811c8c080a05be78a/index.js#L35-L49
		// https://github.com/mapbox/pbf/blob/89ed77309c7c646b809251b811c8c080a05be78a/index.js#L205-L212
		// https://developers.google.com/protocol-buffers/docs/encoding#structure
		const keyPos = pbf.pos // position of the key
		const val = pbf.readVarint()
		const keyLength = pbf.pos - keyPos
		const fieldNr = val >> 3 // cut last three bits
		const wireType = val & 0x7 // only consider last three bits

		let dataPos = pbf.pos // position of the data
		if (wireType === Pbf.Varint) {
			// eslint-disable-next-line no-empty
			while (pbf.buf[pbf.pos++] > 0x7f) {}
		} else if (wireType === Pbf.Bytes) {
			const length = pbf.readVarint()
			dataPos = pbf.pos
			pbf.pos = length + pbf.pos
		} else if (wireType === Pbf.Fixed32) {
			pbf.pos += 4
		} else if (wireType === Pbf.Fixed64) {
			pbf.pos += 8;
		} else {
			const err = new Error(`unsupported wire type ${wireType} at byte ${keyPos}`)
			err.code = 'UNSUPPORTED_WIRE_TYPE'
			err.pos = keyPos
			err.wireType = wireType
			throw err
		}

		yield {
			keyPos, keyLength,
			fieldNr, wireType,
			dataPos, dataLength: pbf.pos - dataPos,
		}
	}
}

const annotate = function* (buf, offset = 0, end = buf.length) {
	for (let field of scan(buf, offset, end)) {
		// parse nested messages
		if (field.wireType == Pbf.Bytes) {
			const end = field.dataPos + field.dataLength
			try {
				const nested = Array.from(annotate(buf, field.dataPos, end))
				field = {...field, nested}
			} catch (err) {
				if (err.code !== 'UNSUPPORTED_WIRE_TYPE') throw err
			}
		}

		yield field
	}
}

annotate.scan = scan
module.exports = annotate
