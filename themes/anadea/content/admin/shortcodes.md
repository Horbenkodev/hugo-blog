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

{{< advert_with_cta title="Title" description="Description" button="Button text" >}}

```go
{{</* ctabutton href='#' */>}}Text{{</* /ctabutton */>}}
```

{{< ctabutton href='#' >}}Text{{< /ctabutton >}}
