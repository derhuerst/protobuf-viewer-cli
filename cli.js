#!/usr/bin/env node
'use strict'

const mri = require('mri')
const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v',
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
todo
\n`)
	process.exit(0)
}

if (argv.version || argv.v) {
	process.stdout.write(`${pkg.name} v${pkg.version}\n`)
	process.exit(0)
}

const {readFile} = require('fs')
const {buffer: asBuffer} = require('get-stream')
const annotate = require('.')
const render = require('./lib/render')

const showError = (err) => {
	if (process.env.NODE_ENV === 'dev') console.error(err)
	else console.error(err.message || (err + ''))
	process.exit(1)
}

;(async () => {
	const buf = argv._[0]
		? await readFile(argv._[0])
		: await asBuffer(process.stdin)

	process.stdout.write(render(buf, annotate(buf)))
})()
.catch(showError)
