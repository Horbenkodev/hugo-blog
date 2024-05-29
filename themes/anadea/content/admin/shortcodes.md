---
title: Shortcodes for markdown
layout: shortcodes
build:
  list: never
---

```go
{{</* advert */>}}Text{{</* /advert */>}}
```

{{< advert >}}Text{{< /advert >}}

``` go
{{</* advert_with_cta title="Title" description="Description" button="Button text" */>}}
```

With custom link

``` go
{{</* advert_with_cta title="Title" description="Description" button="Button text" url="https://example.com" */>}}
```

{{< advert_with_cta title="Title" description="Description" button="Button text" >}}

```go
{{</* ctabutton */>}}Text{{</* /ctabutton */>}}
```

With custom link

```go
{{</* ctabutton href="https://example.com" */>}}Text{{</* /ctabutton */>}}
```

{{< ctabutton >}}Text{{< /ctabutton >}}
