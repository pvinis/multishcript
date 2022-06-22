#!/usr/bin/env deno run

import { existsSync } from "https://deno.land/std/fs/mod.ts"

if (Deno.args.length !== 1) {
	console.log(
		"Only use one arg, with the path to the multishcript you want to run."
	)
	Deno.exit(-1)
}

const file = Deno.args[0]

if (!existsSync(file)) {
	console.log("Multishcript file doesn't exist.")
	Deno.exit(-1)
}

console.log("after")
