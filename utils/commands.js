import chalk from "chalk";
import os from "node:os";
import program from "./commander.js";
import { saveDB } from "./db.js";
import { listGuilds, registerGuild, registerPrompt } from "./register.js";
import { listTask, registerPromptTasks, registerTasks } from "./tasks.js";

program
	.command("register ")
	.description("Enregistrer une guilde")
	.option("-r, --rank <rank>", "Rang de la guilde")
	.option("-n, --name <guildName>", "Nom  de la guilde")
	.action(async function () {
		const { name, rank } = this.opts();
		const data = await registerPrompt({ name, rank });
		await registerGuild(data);
		chalk.green("Guilde ajoutée avec succès !");
	});

program
	.command("assign-tasks")
	.description("Assigner les tâches quotidiennes aux guildes")
	.action(async () => {
		const guilds = await listGuilds();
		const tasks = await listTask();

		tasks.forEach(async (task) => {
			if (task.completed) return;
			const guild = guilds.find((guild) => guild.rank === task.priority);
			if (!guild) return;
			guild.tasks.push(task.id);
		});
			console.log({ guilds, tasks });
	
		await saveDB({ guilds, tasks });
		console.log(
			chalk.blue(
				"Les tâches quotidiennes ont été assignées à toutes les guildes.",
			),
		);
	});

program.command("list").action(async (list) => {
	const guilds = await listGuilds();
	console.log(chalk.blue.bold("Liste des guildes :"));
	console.log({ guilds });
	const tasks = await listTask();
	console.log(chalk.blue.bold("Liste des tâches :"));
	console.log({ tasks });
});

program
	.command("add")
	.description("Ajouter une nouvelle tâche")
	.action(async () => {
		const data = await registerPromptTasks();
		await registerTasks(data);
		console.log(chalk.green("Tâche ajoutée avec succès !"));
	});

program
	.command("complete <id>")
	.description("Marquer une tâche comme complétée")
	.action(async (id) => {
		const tasks = await listTask();

		console.log({ id });
		const findedTask = tasks?.find((task) => task.id === +id);

		if (findedTask) {
			findedTask.completed = true;
			const guilds = await listGuilds();
			await saveDB({ guilds, tasks });
			console.log(chalk.green("Tâche complétée !"));
		} else {
			console.log(chalk.red("Tâche non trouvée."));
		}
	});


  

program
	.command("system-info")
	.description("Afficher les informations système du monde")
	.action(() => {
		console.log(chalk.blue("Informations système du monde :"));
		console.log(`Ressource principale : ${os.type()}`);
		console.log(
			`Mémoire disponible : ${(os.freemem() / 1024 ** 3).toFixed(2)} Go`,
		);
	});
