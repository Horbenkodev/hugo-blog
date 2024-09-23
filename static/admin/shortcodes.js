/* eslint-disable no-undef */
function handleShortcodes() {
  const PostPreview = createClass({
    render: function () {
      const entry = this.props.entry;
      const image = entry.getIn(['data', 'image']);
      const bg = this.props.getAsset(image);

      const shortcodesStyle = {
        background: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        bottom: '0',
        right: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '32px',
        padding: '0 40px',
      };

      const link = h(
        'a',
        {
          href: '/blog/admin/shortcodes',
          target: '_blank',
          className: 'shortcodes__link',
        },
        'Shortcodes preview',
      );

      return h(
        'div',
        { style: { fontFamily: 'StemText', padding: '0 20px' } },
        h('h1', {}, entry.getIn(['data', 'title'])),
        h('img', { src: bg.toString(), style: { maxWidth: '100%' } }),
        h('div', { className: 'markdown' }, this.props.widgetFor('body')),
        h('div', { style: shortcodesStyle }, link),
      );
    },
  });

  CMS.registerPreviewStyle('{{ $application }}');
  CMS.registerPreviewStyle('{{ $post }}');
  CMS.registerPreviewTemplate('posts', PostPreview);
}

window.addEventListener('load', handleShortcodes);
