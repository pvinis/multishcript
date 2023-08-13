export const guardArgs = (args: string[]) => {
	if (args.length !== 1) {
		console.log(
			"Only use one arg, with the path to the multishcript you want to run.",
		)
		Deno.exit(1)
	}
}

export const guardFileExists = (file: string) => {
	try {
		Deno.statSync(file)
	} catch (err) {
		if (err instanceof Deno.errors.NotFound) {
			console.log("Multishcript file doesn't exist.")
			Deno.exit(2)
		}
	}
}
