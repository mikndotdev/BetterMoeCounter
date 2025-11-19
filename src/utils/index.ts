const log_level = process.env.LOG_LEVEL || "info";

const levels = ["none", "error", "warn", "info", "debug"];
const currentLevelIndex = levels.indexOf(log_level);

const buildLogMethod =
	(level: string) =>
	(...args: any[]) => {
		const levelIndex = levels.indexOf(level);
		const shouldLog = levelIndex <= currentLevelIndex;

		if (shouldLog) {
			(console as any)[level](...args);
		}
	};

export const randomArray = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)] as T;
};

export const toFixed = (num: number, digits = 2): number => {
	return parseFloat(Number(num).toFixed(digits));
};

export const logger = {
	debug: buildLogMethod("debug"),
	info: buildLogMethod("info"),
	warn: buildLogMethod("warn"),
	error: buildLogMethod("error"),
};
