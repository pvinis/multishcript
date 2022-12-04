#!/usr/bin/env yarn ts-node

import {
	writeFileSync,
	existsSync,
	readFileSync,
	mkdirSync,
	chmodSync,
} from "fs"
import { map, pipe, filter, last, reject, reduce, forEach } from "remeda"

const ERRORS = { NO_EXACTLY_ONE_ARG: 1, FILE_DOES_NOT_EXIST: 2 }
const DELIMITERS = ["```", "___"]

if (process.argv.length !== 3) {
	console.log(
		"Only use one arg, with the path to the multishcript you want to run.",
	)
	process.exit(ERRORS.NO_EXACTLY_ONE_ARG)
}

const file = last(process.argv)!

if (!existsSync(file)) {
	console.log("Multishcript file doesn't exist.")
	process.exit(ERRORS.FILE_DOES_NOT_EXIST)
}

const input = readFileSync(file).toString()
const lines = input.split("\n")

type CodeBlock = { lang: string; code: string[] }

const codeblocks = pipe(
	lines,
	reject((line) => line === ""), // remove empty lines
	reject((line) => line.startsWith("#")), // remove comments
	reduce((acc, cur) => {
		if (DELIMITERS.includes(cur.slice(0, 3))) {
			const lang = cur.slice(3)
			if (lang !== "") {
				// start of code block
				return [...acc, { lang, code: [] }]
			} else {
				// end of code block
				return acc
			}
		}

		return [
			...acc.slice(0, -1),
			{ ...last(acc)!, code: [...last(acc)!.code, cur] },
		]
	}, [] as CodeBlock[]), // group blocks
)

// create temp script files
if (!existsSync(".tmp")) mkdirSync(".tmp", {})
const pad = codeblocks.length.toString().length
forEach.indexed(codeblocks, (block, index) => {
	const tempFile = `${String(index).padStart(pad, "0")}-${block.lang}`
	writeFileSync(
		`.tmp/${tempFile}`,
		`#!/usr/bin/env ${block.lang}\n\n` + block.code.join("\n"),
		{ flag: "w+", mode: 0o766 },
	)
})

/// run the temp file

console.log(JSON.stringify(codeblocks, null, 2))
