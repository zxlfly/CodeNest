import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "累了就休息下吧",
	lang: "zh-cn",
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
					// {
					// 	items: [
					// 		{ text: "html", link: "/packages/html/" },
					// 		{ text: "css", link: "/packages/css/" },
					// 	],
					// },
					// {
					// 	items: [
					// 		{
					// 			text: "javascript",
					// 			link: "/packages/javascript/",
					// 		},
					// 		{
					// 			text: "typescript",
					// 			link: "/packages/typescript/",
					// 		},
					// 	],
					// },
					{
						items: [
							{
								text: "web基础",
								link: "/packages/web/",
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
								text: "工程化",
								link: "/packages/engineering/",
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
			"/packages/web/": [
				{ text: "基本介绍", link: "/packages/web/" },
				{
					text: "html",
					collapsible: true,
					collapsed: false,
					items: [
						{ text: "基本介绍", link: "/packages/html/" },
					],
				},{
					text: "css",
					collapsible: true,
					collapsed: true,
					items: [
						{ text: "基本介绍", link: "/packages/css/" },
					],
				},{
					text: "javascript",
					collapsible: true,
					collapsed: true,
					items: [
						{text: "javascript",link: "/packages/javascript/",},
					],
				},{
					text: "typescript",
					collapsible: true,
					collapsed: true,
					items: [
						{ text: "基本介绍", link: "/packages/typescript/" },
					],
				},{
					text: "常见问题和轮子",
					collapsible: true,
					collapsed: true,
					items: [
						{ text: "基本介绍", link: "/packages/wheel/" },
					],
				},
			],
			"/packages/html/": [
				{
					text: "html",
					items: [
						{ text: "基本介绍", link: "/packages/html/" },
					],
				},
			],
			"/packages/css/": [
				{
					text: "css",
					items: [
						{ text: "基本介绍", link: "/packages/css/" },
					],
				},
			],
			"/packages/javascript/": [
				{
					collapsible: true,
					collapsed: true,
					items: [
						{text: "javascript",link: "/packages/javascript/",},
					],
				},
			],
			"/packages/typescript/": [
				{
					text: "typescript",
					items: [
						{ text: "基本介绍", link: "/packages/typescript/" },
					],
				},
			],
			"/packages/wheel/": [
				{
					text: "常见问题和轮子",
					collapsible: true,
					collapsed: true,
					items: [
						{ text: "基本介绍", link: "/packages/wheel/" },
					],
				}
			],
			"/packages/vue/": [
				{
					text: "vue",
					items: [
						{ text: "基本介绍", link: "/packages/vue/" },
					],
				},
			],
			"/packages/react/": [
				{
					text: "react",
					items: [
						{ text: "基本介绍", link: "/packages/react/" },
					],
				},
			],
			"/packages/webgl/": [
				{ text: "基本介绍", link: "/packages/webgl/" },
				{
					text: "html",
					items: [
						{ text: "基本介绍", link: "/packages/html/" },
					],
				},
			],
			"/packages/algorithm/": [
				{
					text: "algorithm",
					items: [
						{ text: "基本介绍", link: "/packages/algorithm/" },
					],
				},
			],"/packages/dynamic-large-screen/": [
				{
					text: "动态大屏",
					items: [
						{ text: "基本介绍", link: "/packages/dynamic-large-screen/" },
					],
				},
			],"/packages/low-code/": [
				{
					text: "低代码平台",
					items: [
						{ text: "基本介绍", link: "/packages/low-code/" },
					],
				},
			],"/packages/admin-framework/": [
				{
					text: "中后台管理系统框架",
					items: [
						{ text: "基本介绍", link: "/packages/admin-framework/" },
					],
				},
			],"/packages/mini-ui/": [
				{
					text: "UI库搭建",
					items: [
						{ text: "基本介绍", link: "/packages/mini-ui/" },
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
		footer: {
			message: '创作不易请尊重他人劳动成果，未经允许禁止转载',
			copyright: 'Copyright © 2024-present zxlfly'
		  }
	},
});
