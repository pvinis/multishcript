import { guardArgs, guardFileExists } from "./guards.ts"
import { pipe, map, filter, reduce, forEach } from "npm:remeda@1.24.0"
import { COMMENT_START, DELIMITERS } from "./tokens.ts"
import { eachSeries } from "npm:async@3.2.4"
type Codeblock = {
	lang: string
	code: Array<string>
}

const groupBlocks = (lines: string[]) => {
	return reduce(
		lines,
		(acc, next) => {
			const lang = next.match(/```(.+)/) ///// use delimiters
			if (lang) {
				return [...acc, { lang: lang[1], code: [] }]
			} else if (next === "```") {
				////use delimiters
				return acc
			} else {
				const newCode = [...acc[acc.length - 1].code, next]
				const newBlock = { ...acc[acc.length - 1], code: newCode }
				return [...acc.slice(0, -1), newBlock]
			}
		},
		[] as Codeblock[],
	)
}

const ensureTmpDirExists = () => {
	try {
		if (Deno.statSync(".tmp").isDirectory) return
	} catch {
		Deno.mkdirSync(".tmp")
	}
}

///// ;;; checks? what if i dont close with ```, or if i detect an opening ```?

const main = async () => {
	guardArgs(Deno.args)

	const file = Deno.args[0]
	guardFileExists(file)

	const lines = await Deno.readTextFile(file)

	const codeblocks = pipe(
		lines.split("\n"),
		// map((line) => line.trim()),
		filter((line) => line !== ""),
		filter((line) => !line.startsWith(COMMENT_START)),
		groupBlocks,
	)
	// console.log(codeblocks)

	ensureTmpDirExists()

	// make individual files from each block
	const pad = codeblocks.length.toString().length
	const tempFilepaths = [] as string[]
	forEach.indexed(codeblocks, (block, index) => {
		const tempFile = `${String(index).padStart(pad, "0")}-${block.lang}`
		const tempFilepath = `.tmp/${tempFile}`
		Deno.writeTextFileSync(
			tempFilepath,
			`#!/usr/bin/env ${block.lang}\n\n` + block.code.join("\n"),
			{ mode: 0o766 },
		)
		tempFilepaths.push(tempFilepath)
	})

	// run files
	eachSeries(tempFilepaths, async (filepath: string) => {
		const command = new Deno.Command(filepath)

		const { stdout } = await command.output()

		console.log(new TextDecoder().decode(stdout))
	})
}

main()
