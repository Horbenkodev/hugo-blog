---
title: How to Speed Up Your Tests via :build_stubbed
slug: speed-up-tests-via-build-stubbed
draft: false
publishDate: 2017-10-29T00:00:00.000Z
image: build_stubbed.jpg
og_image: build_stubbed.jpg
description: Rspec is a great tool for the Ruby community, but tests can become
  slow in large projects. When test suites take over 30 minutes, something has
  gone wrong.
promote:
  promote: false
top: false
authors:
  - web-development-team
categories:
  - development
  - ruby-on-rails
industries: []
---
Rspec is an awesome thing that was created for ruby community. Most of us write tests. However, sometimes in large projects our test becomes very slow. So, each launch of the test really hurts and it does not meter whether you launch your test before commit/push or on CI. When it takes over 30 minutes to pass your test suit,  something definitely went wrong.

There are many things that you can improve: database clearing, perform caching, stub external requests and so on.

In our project, we use <a href="https://github.com/thoughtbot/factory_bot" rel="nofollow" target="_blank">FactoryGirl</a> (<a href="https://robots.thoughtbot.com/factory_bot" rel="nofollow" target="_blank">FactoryBot</a>). Here I will try to describe how **:build_stubbed** can help us to improve the test speed.

## create:

```ruby
FactoryBot.create(:comment)
```

In this case we will create comment object and all association for it.

## build:

```ruby
FactoryBot.build(:comment)
```

**Warning:** Here is a misconception, we did not save object but we still will have requests to our database if factory has an associations!

**:build** does not create object -  but it creates all association to that object.

```ruby
factory :comment do
 association :post
end

FactoryBot.build(:comment)
(0.1ms) begin transaction
Post Create (0.5ms) INSERT INTO "posts" DEFAULT VALUES
(0.6ms) commit transaction
```

## build_stubbed:

```ruby
FactoryBot.build_stubbed(:comment)
```

**:build_stubbed** does not call database at all. It just creates and assigns attributes to an object to make it behave like instantiated object. It have an assigned `id`. Thats why we have such a speed-up.

{{< advert >}}What about association?{{< /advert >}}

Association also works. `build_stubbed` will create the associations via `build_stubbed`, while `build` will `create` real association.

```ruby
comment = FactoryBot.build_stubbed(:comment)
#<Comment:0x007f94d2b92df0 id: 1002, post_id: 1001, body: "text">
comment.post
#<Post:0x007f94d5883440 id: 1001, name: nil>
```

{{< advert >}}Also, do you actually need to reference the post in every single test?{{< /advert >}}

Note: remember that `build_stubbed` stubs next methods:

* `persisted?`
* `new_record?`
* `created_at`

Also remember that next methods will cause an exception:

* `update_attribute`
* `update_column`
* `save`
* `destroy`
* `connection`
* `reload`

```ruby
comment.save
RuntimeError: stubbed models are not allowed to access the database - Comment#save()
```

## Conclusion

Using `build_stubbed` is not a perfect solution for every situation. However, it can be a great approach in some cases. For example, when you test models or services.
