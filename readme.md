# protobuf-viewer-cli

**Inspect (encoded) [protocol buffers](https://developers.google.com/protocol-buffers) in the command line,** without knowning the schema. Prints the data in a nested layout.

[![npm version](https://img.shields.io/npm/v/protobuf-viewer-cli.svg)](https://www.npmjs.com/package/protobuf-viewer-cli)
[![build status](https://api.travis-ci.org/derhuerst/protobuf-viewer-cli.svg?branch=master)](https://travis-ci.org/derhuerst/protobuf-viewer-cli)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/protobuf-viewer-cli.svg)
![minimum Node.js version](https://img.shields.io/node/v/protobuf-viewer-cli.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me via GitHub Sponsors](https://img.shields.io/badge/support%20me-donate-fa7664.svg)](https://github.com/sponsors/derhuerst)

*Note:* Essentially, it does the same as the [official protobuf](https://github.com/protocolbuffers/protobuf) `protoc` tool with the `--decode_raw` option.


## Installation

```shell
npm install -g protobuf-viewer-cli
```

Or use [`npx`](https://npmjs.com/package/npx). ✨


## Usage

```shell
protobuf-viewer <some-protocol-buffer.pbf
```

![screenshot of example output](screenshot.png)


## Contributing

If you have a question or need support using `protobuf-viewer-cli`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, use [the issues page](https://github.com/derhuerst/protobuf-viewer-cli/issues).
