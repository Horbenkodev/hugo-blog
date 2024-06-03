/* eslint-disable no-undef */
function handleCustomSnippet() {
  CMS.registerEditorComponent({
    id: 'ctabutton',
    label: 'CTAbutton',
    fields: [
      { name: 'content', label: 'Content', widget: 'text' },
      { name: 'href', label: 'href', widget: 'string' },
    ],
    pattern: /{{< ctabutton href="([a-zA-Z0-9-_ :/.]+)" >}}([a-zA-Z0-9-_ .,!]+){{< \/ctabutton >}}/,
    fromBlock: function (match) {
      return {
        href: match[1],
        content: match[2],
      };
    },
    toBlock: function (obj) {
      const href = obj.href ? obj.href : 'https://anadea.info/contacts';
      return `{{< ctabutton href="${href}" >}}${obj.content}{{< /ctabutton >}}`;
    },
    toPreview: function (obj) {
      return `<div class="center">
                  <a href="${obj.href}" target="_blank" rel="noopener" class="ctaButton">${obj.content}</a>
                </div>`;
    },
  });

  CMS.registerEditorComponent({
    id: 'Advert',
    label: 'Advert',
    fields: [{ name: 'content', label: 'Content', widget: 'text' }],
    pattern: /{{< advert >}}(.+){{< \/advert >}}/,

    fromBlock: function (match) {
      return {
        content: match[1],
      };
    },
    toBlock: function (obj) {
      return `{{< advert >}}${obj.content}{{< /advert >}}`;
    },
    toPreview: function (obj) {
      return `<section class="advert">
                <div class="advert__description">
                  ${obj.content}
                </div>
              </section>`;
    },
  });

  CMS.registerEditorComponent({
    id: 'AdvertWithCTA',
    label: 'AdvertWithCTA',
    fields: [
      { name: 'title', label: 'Title', widget: 'string' },
      { name: 'content', label: 'Content', widget: 'text' },
      { name: 'href', label: 'Href', widget: 'string' },
      { name: 'button', label: 'Button', widget: 'string' },
    ],
    pattern:
      /{{< advert_with_cta title="([a-zA-Z0-9-_ .,/:()!"'“”]+)" description="(.+)" button="([a-zA-Z0-9-_ !]+)" url="([a-zA-Z:/?.-_ ]+)" >}}/,
    fromBlock: function (match) {
      return {
        title: match[1],
        content: match[2],
        button: match[3],
        href: match[4],
      };
    },
    toBlock: function (obj) {
      const href = obj.href || 'https://anadea.info/contacts';
      const button = obj.button || 'Get in touch';
      const title = obj.title?.replaceAll(/("\b)(?<content>.+)("\B)/g, `“$<content>”`);
      return `{{< advert_with_cta title="${title}" description="${obj.content?.replaceAll(`"`, `'`)}" button="${button}" url="${href}" >}}`;
    },
    toPreview: function (obj) {
      const titleContent = obj.title?.replaceAll(/("\b)(?<content>.+)("\B)/g, `“$<content>”`);
      const title = obj.title ? `<h2 class="advertWithCTA__title">${titleContent}</h2>` : '';
      const href = obj.href || 'https://anadea.info/contacts';
      const button = obj.button || 'Get in touch';
      return `<section class="advertWithCTA">
                ${title}
                <div class="advertWithCTA__description">
                  ${obj.content}
                </div>
                <a href="${href}" class="advertWithCTA__button">${button}</a>
              </section>`;
    },
  });

  CMS.registerEditorComponent({
    id: 'youtube',
    label: 'Youtube',
    fields: [
      {
        name: 'id',
        label: 'Youtube Video ID',
        widget: 'string',
      },
    ],
    pattern: /{{< youtube\s+(?<id>[A-Za-z0-9-]+)\s+>}}/,
    fromBlock: function (match) {
      return {
        id: match[1],
      };
    },
    toBlock: function (obj) {
      return `{{< youtube ${obj.id} >}}`;
    },
    toPreview: function (obj) {
      return `<img src="https://i3.ytimg.com/vi/${obj.id}/hqdefault.jpg" alt="Youtube Video"/>`;
    },
  });

  CMS.registerEditorComponent({
    id: 'sub',
    label: 'Sub',
    fields: [{ name: 'content', label: 'Content', widget: 'text' }],
    pattern: /{{< sub >}}(.+){{< \/sub >}}/,
    fromBlock: function (match) {
      return {
        content: match[1],
      };
    },
    toBlock: function (obj) {
      return `{{< sub >}}${obj.content}{{< /sub >}}`;
    },
    toPreview: function (obj) {
      return `<div class="sub">
                ${obj.content}
              </div>`;
    },
  });
}

window.addEventListener('load', handleCustomSnippet, { once: true });
