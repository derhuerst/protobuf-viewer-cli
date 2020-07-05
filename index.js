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
		const fieldNr = val >> 3 // cut last three bits
		const wireType = val & 0x7 // only consider last three bits
		const dataPos = pbf.pos // position of the data

		if (wireType === Pbf.Varint) {
			while (pbf.buf[pbf.pos++] > 0x7f) {}
		} else if (wireType === Pbf.Bytes) {
			pbf.pos = pbf.readVarint() + pbf.pos
		} else if (wireType === Pbf.Fixed32) {
			pbf.pos += 4
		} else if (wireType === Pbf.Fixed64) {
			pbf.pos += 8;
		} else {
			const err = new Error(`unsupported wire type ${wireType} at byte ${keyPos}`)
			err.pos = keyPos
			err.wireType = wireType
			throw err
		}

		yield {
			keyPos, fieldNr, wireType,
			dataPos, dataLength: pbf.pos - dataPos,
		}
	}
}

const annotate = (buf, offset = 0, end = buf.length) => {
	const ranges = []
	for (const item of scan(buf, offset, end)) {
		ranges.push([
			item,
			item.keyPos, // from
			item.dataPos - item.keyPos + item.dataLength, // length
		])
	}

	return flattenRanges(ranges)
}

module.exports = annotate
