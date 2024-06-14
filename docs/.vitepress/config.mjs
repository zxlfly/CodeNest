import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "今天你学习了吗",
	// base: "/theRoadIHaveTaken/", // 项目的根路径
	ignoreDeadLinks: false, // 构建时会忽略md中的外链
	markdown: {
		// theme: 'material-palenight',//md主题
		lineNumbers: true, //md 加行号
	},
	lastUpdated: false, //显示最近更新时间
	appearance: true, //可以选择深浅主题
	head: [
		// 设置 描述 和 关键词
		[
			"meta",
			{ name: "keywords", content: "八股文,web,web前端,面试,学习,图形,webgl,webgpu,vue,vue2,vue3,react,uniapp" },
		],
		[
			"meta",
			{
				name: "description",
				content: "八股文,web,web前端,面试,学习,图形",
			},
		],
		[
			"link",
			{
				rel: "shortcut icon",
				type: "image/x-icon",
				href: "./favicon.ico",
			},
		],
	],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		logo: "https://avatars.githubusercontent.com/u/26324442?s=96&v=4",
		lastUpdatedText: "更新时间",
		outlineTitle: "目录",
		nav: [
			{ text: "首页", link: "/" },
			{ text: "参与进来", link: "/joinus" },
			{
				text: "模块列表",
				items: [
					{
						items: [
							{ text: "html", link: "/packages/html/" },
							{ text: "css", link: "/packages/css/" },
						],
					},
					{
						items: [
							{
								text: "javascript",
								link: "/packages/javascript/",
							},
							{
								text: "typescript",
								link: "/packages/typescript/",
							},
						],
					},
					{
						items: [
							{
								text: "vue",
								link: "/packages/vue/",
							},
							{
								text: "react",
								link: "/packages/react/",
							},
						],
					},
					{
						items: [
							{
								text: "webgl",
								link: "/packages/webgl/",
							},
						],
					},
					{
						items: [
							{
								text: "算法",
								link: "/packages/algorithm/",
							},
						],
					},
				],
			},
		],

		sidebar: {
			"/packages/javascript/": [
				{
					collapsible: true,
					collapsed: true,
					items: [
						{
							text: "javascript",
							link: "/packages/javascript/",
						},
					],
				},
			],
			"/packages/css/": [
				{
					text: "css",
					items: [
						{ text: "Index", link: "/packages/css/" },
						{ text: "One", link: "/packages/css/one" },
						{ text: "Two", link: "/packages/css/two" },
					],
				},
			],
			"/packages/html/": [
				{
					text: "html",
					items: [
						{ text: "Index", link: "/packages/html/" },
						{ text: "One", link: "/packages/html/one" },
						{ text: "Two", link: "/packages/html/two" },
					],
				},
			],
			"/packages/typescript/": [
				{
					text: "typescript",
					items: [
						{ text: "Index", link: "/packages/typescript/" },
						{ text: "One", link: "/packages/typescript/one" },
						{ text: "Two", link: "/packages/typescript/two" },
					],
				},
			],
			"/packages/vue/": [
				{
					text: "vue",
					items: [
						{ text: "Index", link: "/packages/vue/" },
						{ text: "One", link: "/packages/vue/one" },
						{ text: "Two", link: "/packages/vue/two" },
					],
				},
			],
			"/packages/react/": [
				{
					text: "react",
					items: [
						{ text: "Index", link: "/packages/react/" },
						{ text: "One", link: "/packages/react/one" },
						{ text: "Two", link: "/packages/react/two" },
					],
				},
			],
			"/packages/webgl/": [
				{
					text: "webgl",
					items: [
						{ text: "Index", link: "/packages/webgl/" },
						{ text: "One", link: "/packages/webgl/one" },
						{ text: "Two", link: "/packages/webgl/two" },
					],
				},
			],
			"/packages/algorithm/": [
				{
					text: "algorithm",
					items: [
						{ text: "Index", link: "/packages/algorithm/" },
						{ text: "One", link: "/packages/algorithm/one" },
						{ text: "Two", link: "/packages/algorithm/two" },
					],
				},
			],
		},

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/zxlfly/CodeNest",
			},
		],
	},
});
