/* eslint-disable no-undef */
function handleCustomSnippet() {
  CMS.registerEditorComponent({
    id: 'ctabutton',
    label: 'CTAbutton',
    fields: [
      { name: 'content', label: 'Content', widget: 'text' },
      { name: 'href', label: 'href', widget: 'text' },
    ],
    pattern: /{{< ctabutton href="([a-zA-Z0-9-_ :/.]+)" >}}([a-zA-Z0-9-_ .,/:()!"']+){{< \/ctabutton >}}/,
    fromBlock: function (match) {
      return {
        href: match[1] ? match[1] : '',
        content: match[2] ? match[2] : '',
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
    pattern: /{{< advert >}}([a-zA-Z0-9-_ .,/:()!"']+){{< \/advert >}}/,

    fromBlock: function (match) {
      return {
        href: match[1] ? match[1] : '',
        content: match[2] ? match[2] : '',
      };
    },
    toBlock: function (obj) {
      return `{{< advert >}}${obj.content}{{< /advert >}}`;
    },
    toPreview: function (obj) {
      return `<section class="advert">
                <p class="advert__description">
                  ${obj.content}
                </p>
              </section>`;
    },
  });

  CMS.registerEditorComponent({
    id: 'AdvertWithCTA',
    label: 'AdvertWithCTA',
    fields: [
      { name: 'title', label: 'Title', widget: 'text' },
      { name: 'content', label: 'Content', widget: 'text' },
      { name: 'href', label: 'Href', widget: 'text' },
      { name: 'button', label: 'Button', widget: 'text' },
    ],
    pattern:
      /{{< advert_with_cta title="([a-zA-Z0-9-_ .,/:()!\"']+)" description="([a-zA-Z0-9-_ .,/:()!\"']+)" button="([a-zA-Z0-9-_ .,/:()!\"']+)" >}}/,

    fromBlock: function (match) {
      return {
        title: match[1] ? match[1] : '',
        content: match[2] ? match[2] : '',
        href: match[3] ? match[3] : '',
        button: match[4] ? match[4] : '',
      };
    },
    toBlock: function (obj) {
      const href = obj.href ? obj.href : 'https://anadea.info/contacts';
      const button = obj.button ? obj.button : 'Get in touch';
      return `{{< advert_with_cta title="${obj.title}" description="${obj.content}" button="${button}" url="${href}" >}}`;
    },
    toPreview: function (obj) {
      const title = obj.title ? `<h2 class="advertWithCTA__title">${obj.title}</h2>` : '';
      const href = obj.href ? obj.href : 'https://anadea.info/contacts';
      const button = obj.button ? obj.button : 'Get in touch';
      return `<section class="advertWithCTA">
                ${title}
                <p class="advertWithCTA__description">
                  ${obj.content}
                </p>
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
    pattern: /{{< youtube\s+(?<id>[A-Za-z0-9\-]+)\s+>}}/,
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
      return `<p class="sub">
                ${obj.content}
              </section>`;
    },
  });
}

window.addEventListener('load', handleCustomSnippet, { once: true });
