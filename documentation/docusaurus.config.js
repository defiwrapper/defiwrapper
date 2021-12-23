/** @type {import('@docusaurus/types').DocusaurusConfig} */

const customFields = {
  githubUrl: `https://github.com/defiwrapper/defiwrapper`,
  discordUrl: `https://discord.gg/weacsjJQ`,
  twitterUrl: `https://twitter.com/polywrap_io`,
  email: `defiwrapper@gmail.com`,
  polyfolioUrl: `https://polyfolio.io`,
};

module.exports = {
  title: 'Defiwrapper',
  tagline: 'Defi - Finally all in one place',
  url: 'https://defiwrapper.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',
  organizationName: 'Defiwrapper',
  projectName: 'documentation',
  themeConfig: {
    sidebarCollapsible: true,
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      logo: {
        alt: 'Defiwrapper',
        src: 'img/defiwrapper-logo-black.svg',
        srcDark: 'img/defiwrapper-logo.svg',
        href: '/',
      },
      items: [
        {
          label: 'Community',
          position: 'left',
          items: [
            {
              label: 'Discord',
              href: customFields.discordUrl,
              className: 'discord-logo',
              'aria-label': 'Polywrap Blog',
            },
            {
              label: 'Twitter',
              href: customFields.twitterUrl,
              className: 'twitter-logo',
              'aria-label': 'twitter account',
            },
            {
              label: 'Github',
              href: customFields.githubUrl,
              className: 'github-logo',
              'aria-label': 'github account',
            },
          ],
        },
        {
          label: 'Donate',
          position: 'left',
          items: [
            {
              label: 'Gitcoin',
              href: customFields.gitcoinUrl,
              className: 'gitcoin-logo',
              'aria-label': 'gitcoin grant',
            },
          ],
        },
        {
          label: 'Products',
          position: 'right',
          items: [
            {
              label: 'Polyfolio',
              href: customFields.polyfolioUrl,
              className: 'polyfolio-logo',
              'aria-label': 'Polyfolio',
            },
          ],
        },
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/vsDark'),
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/defiwrapper/documentation/tree/main',
          routeBasePath: '/',
        },
        theme: {
          customCss: require.resolve('./style.css'),
        },
        pages: {
          path: 'src/pages'
        }
      },
    ],
  ],
  plugins: [require.resolve('docusaurus-lunr-search')],
};
