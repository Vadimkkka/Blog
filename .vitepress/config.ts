import { defineConfig } from 'vitepress'
import getBlogSidebarItems from './blog-sidebar-items'
import ColorfulCheckbox from 'markdown-it-colorful-checkbox'
import slugify from '@sindresorhus/slugify';

const srcDir = 'src'
const base = '/'
const blogDir = '/blog/'
const blogSidebarItems = getBlogSidebarItems(srcDir, blogDir)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  markdown: {
    config(md) {
      md.use(ColorfulCheckbox)
    },
    anchor: { level: 2, slugify },
    image: { lazyLoading: true }
  },
  sitemap: { hostname: 'https://vadimkkka.github.io' },
  base,
  title: 'Goosveridze',
  description: 'A Vadimkkka site',
  srcDir,
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ['link', { rel: 'shortcut icon', href: `${base}favicon.ico`}],
    ['meta', { name: 'keywords', content: 'dev blog' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#1b1b1f' }],
    ['meta', { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' }],
    ['meta', { name: 'robots', content: 'index, archive' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'Goosveridze' }],
    ['meta', { name: 'og:image', content: `https://vadimkkka.github.io${base}me.png` }],
  ],
  // https://vitepress.dev/reference/default-theme-config
  themeConfig: {
    logo: '/oni.png',
    search: { provider: 'local' },
    nav: [
      { text: 'Home', link: base },
      { text: 'Blog', link: blogDir },
    ],
    sidebar: {
      [blogDir]: [{ text: 'Articles', link:  blogDir, items: blogSidebarItems }],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Vadimkkka' }
    ],
  },
  locales: {
    root: { label: 'English', lang: 'en' },
    ru: {
      label: 'Русский',
      lang: 'ru',
      title: 'Гусь',
      description: 'Vadimkkka сайт',
      head: [
        ['meta', { name: 'keywords', content: 'разработка блог' }],
        ['meta', { name: 'og:locale', content: 'ru' }],
        ['meta', { name: 'og:site_name', content: 'Гусь' }],
      ],
      themeConfig: {
        nav: [
          { text: 'Главная', link: 'ru' },
          { text: 'Блог', link: 'ru/blog' },
        ],
        sidebar: {
          [blogDir]: [{ text: 'Статьи', link:  blogDir, items: blogSidebarItems }],
        },
      }
    }
  }
})
