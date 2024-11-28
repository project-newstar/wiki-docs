import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import path from 'path'
import fs from 'node:fs'
import YAML from 'yaml'
import svgLoader from 'vite-svg-loader'

import ElementPlus from 'unplugin-element-plus/vite'

const themeConfig: DefaultTheme.Config = YAML.parse(fs.readFileSync('./theme-config.yml', 'utf8'))

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "NewStar CTF",
    description: "A CTF game designed for beginners",
    lang: 'zh-CN',

    // load yaml config from file will lose type hint
    themeConfig: Object.assign({}, <Partial<DefaultTheme.Config>>{
        siteTitle: 'NewStar CTF',

        socialLinks: [
            { icon: 'github', link: 'https://github.com/Cnily03/newstar-docs' }
        ],

        search: {
            provider: 'local',
        },

        externalLinkIcon: false,

        notFound: {
            quote: '这里什么都没有',
            linkLabel: '返回首页',
            linkText: '返回首页',
        },

        head: [
            [
                'script',
                { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-Q89M3V8EG8' }
            ],
            [
                'script',
                {},
                `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-Q89M3V8EG8');`
            ]
        ],

        footer: {
            copyright: 'Copyright © NewStar CTF',
            message: `<a href="https://beian.miit.gov.cn/" target="_blank" style="text-decoration: none;">浙ICP备2023000643号-8</a>`,
        },

        returnToTopLabel: '返回顶部',

        sidebarMenuLabel: '目录',

        docFooter: {
            prev: '上一篇',
            next: '下一篇',
        },

        outline: {
            label: '本页导航',
            level: [2, 3]
        },

        lastUpdated: {
            text: '最后更新于',
            formatOptions: {
                dateStyle: 'medium',
                timeStyle: 'short',
            }
        }
    }, themeConfig),

    head: [
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
        ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
        ['link', { rel: 'manifest', href: '/site.webmanifest' }],
        ['link', { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#ec9c1e' }],
        ['meta', { name: 'msapplication-TileColor', content: '#f0f0f0' }],
        ['meta', { name: 'theme-color', content: '#f0f0f0' }],
    ],

    sitemap: {
        hostname: 'https://ns.openctf.net'
    },

    markdown: {
        math: true,
    },

    srcDir: 'docs',
    outDir: 'dist',
    assetsDir: 'assets',
    cacheDir: '.cache/.vite',
    vite: {
        // https://vitejs.dev/config/
        publicDir: path.resolve(import.meta.dirname, 'public'),
        server: {
            port: 5170,
            host: '0.0.0.0',
        },
        resolve: {
            alias: {
                '@': path.resolve('theme'),
                '@docs': path.resolve('docs')
            }
        },
        plugins: [
            svgLoader(),
            // auto import style
            ElementPlus({
                format: 'esm',
            }),
        ],
        ssr: { noExternal: ['element-plus'] }
    }
})
