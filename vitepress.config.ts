import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import path from 'path'
import fs from 'node:fs'
import YAML from 'yaml'

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
            { icon: 'github', link: 'https://github.com/cnily03/newstar-docs' }
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

        footer: {
            copyright: 'Copyright © NewStar CTF',
        },

        returnToTopLabel: '返回顶部',

        sidebarMenuLabel: '目录',

        docFooter: {
            prev: '上一篇',
            next: '下一篇',
        },

        outline: {
            label: '本页导航'
        }
    }, themeConfig),

    sitemap: {
        hostname: 'https://ns.openctf.net'
    },

    srcDir: 'docs',
    outDir: 'dist',
    assetsDir: 'assets',
    cacheDir: '.cache/.vite',
    vite: {
        // https://vitejs.dev/config/
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
            // auto import style
            ElementPlus({
                format: 'esm',
            }),
        ],
        ssr: { noExternal: ['element-plus'] }
    }
})
