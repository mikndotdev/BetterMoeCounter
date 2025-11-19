import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export async function getNum(name: string) {
	const value = await redis.get(`counter:${name}`);
	if (value) {
		return { name, num: parseInt(value, 10) };
	}
	return null;
}

export async function getAll() {
	const keys = await redis.keys("counter:*");
	const results = [];

	for (const key of keys) {
		const value = await redis.get(key);
		if (value) {
			const name = key.replace("counter:", "");
			results.push({ name, num: parseInt(value, 10) });
		}
	}

	return results;
}

export async function setNum(name: string, num: number) {
	await redis.set(`counter:${name}`, num);
}

export async function setNumMulti(
	counters: Array<{ name: string; num: number }>,
) {
	const pipeline = redis.pipeline();

	for (const counter of counters) {
		pipeline.set(`counter:${counter.name}`, counter.num);
	}

	await pipeline.exec();
}
