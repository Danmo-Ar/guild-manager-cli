import program from "./commander.js";

(() => {
	program
		.name("guild-manager")
		.usage("<command> [options]")
		.version("1.0.0")
		.description("Un CLI pour gérer les guildes dans un monde alternatif")
		.action(() => {
			program.outputHelp();
		});

	// start the cli

	program.parse(process.argv);
})();
