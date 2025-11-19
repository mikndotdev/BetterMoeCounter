import { Elysia, t } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { cors } from "@elysiajs/cors";
import { Redis } from "ioredis";
import { renderIndexPage } from "./views/index.js";
import { themeList, getCountImage } from "./utils/themify.js";
import { randomArray, logger } from "./utils/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

let __cache_counter: Record<string, number> = {};
let enablePushDelay = Number(process.env.DB_INTERVAL) > 0;
let needPush = false;

if (enablePushDelay) {
	setInterval(() => {
		needPush = true;
	}, 1000 * Number(process.env.DB_INTERVAL));
}

async function pushDB() {
	if (Object.keys(__cache_counter).length === 0) return;
	if (enablePushDelay && !needPush) return;

	try {
		needPush = false;
		logger.info("pushDB", __cache_counter);

		const pipeline = redis.pipeline();
		for (const [name, num] of Object.entries(__cache_counter)) {
			pipeline.set(`counter:${name}`, num);
		}
		await pipeline.exec();

		__cache_counter = {};
	} catch (error) {
		logger.error("pushDB is error: ", error);
	}
}

async function getCountByName(
	name: string,
	num?: number,
): Promise<{ name: string; num: number | string }> {
	const defaultCount = { name, num: 0 };

	if (name === "demo") return { name, num: "0123456789" };

	if (num && num > 0) {
		return { name, num };
	}

	try {
		if (!(name in __cache_counter)) {
			const value = await redis.get(`counter:${name}`);
			const currentNum = value ? parseInt(value, 10) : 0;
			__cache_counter[name] = currentNum + 1;
		} else {
			const current = __cache_counter[name];
			if (current !== undefined) {
				__cache_counter[name] = current + 1;
			}
		}

		pushDB();

		return { name, num: __cache_counter[name] || 0 };
	} catch (error) {
		logger.error("get count by name is error: ", error);
		return defaultCount;
	}
}

const app = new Elysia()
	.use(html())
	.use(cors())
	.use(
		staticPlugin({
			assets: path.join(projectRoot, "assets"),
			prefix: "/",
		}),
	)
	.onError(({ code, error, set }: any) => {
		if (code === "VALIDATION") {
			set.status = 400;
			return {
				code: 400,
				message: error.message,
			};
		}
		logger.error("Error:", error);
		return { code: 500, message: "Internal Server Error" };
	})
	.get("/", ({ request }: any) => {
		const url = new URL(request.url);
		const site = process.env.APP_SITE || url.origin;

		return renderIndexPage(site, themeList);
	})
	.get(
		"/@:name",
		async ({ params, query, request, set }: any) => {
			const { name } = params;
			let { theme = "moebooru", num = 0, ...rest } = query;

			set.headers["content-type"] = "image/svg+xml";
			set.headers["cache-control"] =
				"max-age=0, no-cache, no-store, must-revalidate";

			const data = await getCountByName(String(name), Number(num));

			if (name === "demo") {
				set.headers["cache-control"] = "max-age=31536000";
			}

			if (theme === "random") {
				theme = randomArray(Object.keys(themeList));
			}

			const renderSvg = getCountImage({
				count: data.num,
				theme,
				...rest,
			});

			logger.debug(
				data,
				{ theme, ...query },
				`ip: ${request.headers.get("x-forwarded-for") || "unknown"}`,
				`ref: ${request.headers.get("referer") || null}`,
				`ua: ${request.headers.get("user-agent") || null}`,
			);

			return renderSvg;
		},
		{
			params: t.Object({
				name: t.String({ maxLength: 32 }),
			}),
			query: t.Object({
				theme: t.Optional(t.String({ default: "moebooru" })),
				padding: t.Optional(t.Numeric({ minimum: 0, maximum: 16, default: 7 })),
				offset: t.Optional(
					t.Numeric({ minimum: -500, maximum: 500, default: 0 }),
				),
				align: t.Optional(
					t.Union(
						[t.Literal("top"), t.Literal("center"), t.Literal("bottom")],
						{ default: "top" },
					),
				),
				scale: t.Optional(t.Numeric({ minimum: 0.1, maximum: 2, default: 1 })),
				pixelated: t.Optional(
					t.Union([t.Literal("0"), t.Literal("1")], { default: "1" }),
				),
				darkmode: t.Optional(
					t.Union([t.Literal("0"), t.Literal("1"), t.Literal("auto")], {
						default: "auto",
					}),
				),
				num: t.Optional(t.Numeric({ minimum: 0, maximum: 1e15, default: 0 })),
				prefix: t.Optional(
					t.Numeric({ minimum: -1, maximum: 999999, default: -1 }),
				),
			}),
		},
	)
	.get(
		"/get/@:name",
		async ({ params, query, request, set }: any) => {
			const { name } = params;
			let { theme = "moebooru", num = 0, ...rest } = query;

			set.headers["content-type"] = "image/svg+xml";
			set.headers["cache-control"] =
				"max-age=0, no-cache, no-store, must-revalidate";

			const data = await getCountByName(String(name), Number(num));

			if (name === "demo") {
				set.headers["cache-control"] = "max-age=31536000";
			}

			if (theme === "random") {
				theme = randomArray(Object.keys(themeList));
			}

			const renderSvg = getCountImage({
				count: data.num,
				theme,
				...rest,
			});

			logger.debug(
				data,
				{ theme, ...query },
				`ip: ${request.headers.get("x-forwarded-for") || "unknown"}`,
				`ref: ${request.headers.get("referer") || null}`,
				`ua: ${request.headers.get("user-agent") || null}`,
			);

			return renderSvg;
		},
		{
			params: t.Object({
				name: t.String({ maxLength: 32 }),
			}),
			query: t.Object({
				theme: t.Optional(t.String({ default: "moebooru" })),
				padding: t.Optional(t.Numeric({ minimum: 0, maximum: 16, default: 7 })),
				offset: t.Optional(
					t.Numeric({ minimum: -500, maximum: 500, default: 0 }),
				),
				align: t.Optional(
					t.Union(
						[t.Literal("top"), t.Literal("center"), t.Literal("bottom")],
						{ default: "top" },
					),
				),
				scale: t.Optional(t.Numeric({ minimum: 0.1, maximum: 2, default: 1 })),
				pixelated: t.Optional(
					t.Union([t.Literal("0"), t.Literal("1")], { default: "1" }),
				),
				darkmode: t.Optional(
					t.Union([t.Literal("0"), t.Literal("1"), t.Literal("auto")], {
						default: "auto",
					}),
				),
				num: t.Optional(t.Numeric({ minimum: 0, maximum: 1e15, default: 0 })),
				prefix: t.Optional(
					t.Numeric({ minimum: -1, maximum: 999999, default: -1 }),
				),
			}),
		},
	)
	.get(
		"/record/@:name",
		async ({ params }: any) => {
			const { name } = params;
			const data = await getCountByName(name);
			return data;
		},
		{
			params: t.Object({
				name: t.String(),
			}),
		},
	)
	.get("/heart-beat", ({ set }: any) => {
		set.headers["cache-control"] =
			"max-age=0, no-cache, no-store, must-revalidate";
		logger.debug("heart-beat");
		return "alive";
	})
	.listen(process.env.APP_PORT || 3000);

logger.info(
	`Server is running on port ${app.server?.port || process.env.APP_PORT || 3000}`,
);
