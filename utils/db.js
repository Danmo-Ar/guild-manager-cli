import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

const DB_PATH = new URL("../db/db.json", import.meta.url);

export const getDB = async () => {
	if (!existsSync(DB_PATH)) {
		await saveDB({ guilds: [], tasks: [] });
	}
	const db = await readFile(DB_PATH, "utf-8");

	return JSON.parse(db);
};

export const saveDB = async (data) => {
	await writeFile(DB_PATH, JSON.stringify(data, null, 4));
	return data;
};

export const insertDB = async (value, table) => {
	const db = await getDB();
	db[table].push(value);
	await saveDB(db);
	return value;
};
