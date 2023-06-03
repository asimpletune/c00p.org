# c00p.org

A project to find people who are interested in an alternative path to owning their first home, by starting a housing cooperative: [https://c00p.org](https://c00p.org)

![c00p.org's open graph social preview (horizontal)](/static/preview_banner@0.5x.jpg "I don't mind sharing, do you?")

## Usage

Here's how you do stuff:

`npm install`   installs everything that you need
`npm run build` builds once, output will be in the `public` directory
`npm run serve` starts a local server that binds to `0.0.0.0:1111`, and watches the respective directories and rebuilds upon every change.

For example, you can run `npm run serve` and then go to `localhost:1111` in your browser to see the websites. As you make changes to the code or content, the website will be updated.

## Content

Content is stored in [markdown text](https://commonmark.org/help/) files located within the `content` directory. Files named `_index.md` are called "sections", and files by any other name ending in `.md` are called "pages". For more information you can read the [zola](https://getzola.com) documentation. It is written in markdown and inserted into the html via the "[template](#templates)", which is indicated on the top of the content.

## Templates

Templates are in the `templates` directory. Their purpose is to decide where in the html the content goes. The content is accessible to the template as a variable named either `section.content` or `page.content`, depending on the context.

## Styling

This website uses [tailwindcss](https://tailwindcss.com/) for most of its styling. Additional styling can be added in the `sass/input.scss` file, but usually it is not necessary to add any custom styling. This file is compiled by zola from sass into normal css, and then from there it is read by tailwind which adds whatever additional styling is referenced in the html, resulting in a file called `style.css`, which is what is used by the website.

### Typography

The tailwind [typography plugin](https://tailwindcss.com/docs/typography-plugin) is used to style content that is generated from markdown. Any child elements that are nested within an element that has the class `prose` will receive the styling. The default styling can further be customized in the `tailwind.config.js` file.

## Dependencies and Tools

* [zola](https://getzola.com)@0.17.2
* node@14.0.0
* [tailwindcss](https://tailwindcss.com/)
* [tailwind typography plugin](https://tailwindcss.com/docs/typography-plugin)

## Deployments

This site is deployed using [cloudflare pages](https://pages.cloudflare.com). Access is granted to the project's code repository by this site's admin's cloudflare dash. When a branch is pushed a build is triggered and a new version of the site is deployed. If the branch is the "production" branch then the new version will be deployed at [https://c00p.org](https://c00p.org), otherwise it's deployed to some throwaway branch, usually a truncated version of the version's git branch.

Here are some additional things to know about deployments

* There is a file called [`_headers`](https://github.com/asimpletune/c00p.org/blob/localization-support/static/_headers) which is a convention used by cloudflare pages to set HTTP headers for the static site
* `ZOLA_VERSION=0.17.2` must be explicitly set in cloudflare pages build settings
* `NODE_VERSION=14.0.0` must be explicitly set in cloudflare pages build settings
* There's a file, `CHANGELOG.md`, that helps track what's changed as the site evolves

## Multilingual

The site is designed to be multilingual, and currently offers English and Italian options. English is the default and serves content from the bare [`https://c00p.org/`](https://c00p.org/) path, whereas all others serve content behind a prefix consisting of the language's 2-letter abbreviation, e.g. [`https://c00p.org/it/`](https://c00p.org/it/) for Italian. Any URL from below the two-letter language code prefix will be served regardless of language preference. In other words, language prepreferencef only matters when you visit the default language path, i.e. `/`. More information about language preference based redirects below.

### How to add a translation:

Here's an example of how the Italian translation was added to the home page.

```txt
# this is the original file that has the content for the homepage
/content/_index.md

# this is the same file but translated to italian
/content/_index.it.md
```

So, to add a translation, you find what you want to translate, then add a new file with the translation and make sure the new file is named the same but with the two-letter language code before the `.md`.


### How the language redirects are performed:

When you visit the default language path (i.e. `/`), then a redirect can be performed based on your language preferences. The logic for handling the redirects is not contained within the source code, so they'll be documented here. Redirects are as follows:

* if `?set-lang` is set to `en` or `it`, a redirect is performed, and the client is asked to update the `pref-lang` 🍪
* if `pref-lang` 🍪 is set to `en` or `it`, a redirect is performed
* if neither `?set-lang`, nor 🍪 `pref-lang`, then `Accepted-Language` header is chosen, and client is asked to update the `pref-lang` 🍪

## Notes:

* This site was initially generated using a [GitHub template](https://github.com/asimpletune/zola-tailwindcss) for making zola static sites that work well with tailwindcss.
* The `npm run serve` script runs two long-running tasks in parallel and allows both to write simultaneously to STDOUT by using [a mixture of `wait` and sending jobs to the background](https://www.cyberciti.biz/faq/how-to-run-command-or-code-in-parallel-in-bash-shell-under-linux-or-unix/)
* Sometimes important changes for styling need to be made in the `tailwind.config.js` file
* Builds can break when deployed, and a common place to look is needing to add or update an enviornment variable for cloudflare's "pages" product