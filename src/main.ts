import { guardArgs, guardFileExists } from "./guards.ts"
import { pipe, map } from "npm:remeda@1.24.0"

guardArgs(Deno.args)

const file = Deno.args[0]
guardFileExists(file)

const lines = await Deno.readTextFile(file)

console.log("Hello, world!", lines)

const groupBlocks = (lines: string[]) => {
	const blocks: string[][] = []
	let currentBlock: string[] = []
	for (const line of lines) {
		if (line.startsWith("```")) {
			if (currentBlock.length > 0) {
				blocks.push(currentBlock)
				currentBlock = []
			}
		} else {
			currentBlock.push(line)
		}
	}
	if (currentBlock.length > 0) {
		blocks.push(currentBlock)
	}
	return blocks
}

const codeblocks = pipe(
	[1, 2, 3],
	map((x) => x * 2),
)

console.log(codeblocks)

//// DELIMITERS

///// ;;; checks? what if i dont close with ```, or if i detect an opening ```?

// (defn group-blocks
// 	[acc next]

// 	(let [lang (last (re-matches #"```(.+)" next))]
// 	  (cond
// 		(some? lang) (conj acc {:lang lang :code []})
// 		(= next "```") acc
// 		:else (let [new-code (conj (:code (last acc)) next)
// 					new-map (assoc (last acc) :code new-code)]
// 				(conj (vec (drop-last acc)) new-map)))))

//   (def codeblocks
// 	(->> lines
// 		 (remove #(= "" %))
// 		 (remove #(string/starts-with? % "#"))
// 		 (reduce group-blocks [])))
