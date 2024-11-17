import inquirer from "inquirer";
import { getDB, insertDB } from "./db.js";

export const registerGuild = async (guild) => {
	const guilds = {
		id: Date.now(),
		name: guild.name,
		rank: guild.rank,
		tasks: [],
		schedule: {},
	};
	await insertDB(guilds, "guilds");
	return guilds;
};

export const listGuilds = async () => {
	const db = await getDB();
	return db.guilds;
};

export const registerPrompt = async (guildInfo) => {
	const data = await inquirer.prompt([
		{
			type: "input",
			name: "name",
			message: "Nom de la guilde",
			when: !guildInfo.name,
		},
		{
			type: "list",
			name: "rank",
			message: "Rang de la guilde",
			choices: ["A", "B", "C", "E"],
			when: !guildInfo.rank,
		},
	]);

	if (guildInfo.name) data.name = guildInfo.name;
	if (guildInfo.rank) data.rank = guildInfo.rank;

	return data;
};
