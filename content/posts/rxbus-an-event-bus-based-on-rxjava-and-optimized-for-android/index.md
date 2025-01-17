---
ceoTitle: "RxBus: An Event Bus Based on RxJava & Optimized for Android"
title: RxBus - an Event Bus Based on RxJava and Optimized for Android
draft: false
publishDate: 2017-02-13T00:00:00.000Z
image: side-shot-code-editor-using-react-js.jpg
og_image: side-shot-code-editor-using-react-js.jpg
description: Event bus connects objects across lifecycles and hierarchies.
  Android apps often use libraries like EventBus or the now-deprecated Otto from
  Square.
promote:
  promote: false
top: false
authors:
  - mobile-development-team
categories:
  - development
industries: []
---
Event bus is a great solution that allows objects with different lifecycles and located in different layers of hierarchy to communicate.

I venture to suggest that if you have an event bus in your Android application, most likely you use libraries like <a href="https://github.com/square/otto" rel="nofollow" target="_blank">Otto</a> or <a href="https://github.com/greenrobot/EventBus" rel="nofollow" target="_blank">EventBus</a>.

However, Otto from Square was officially deprecated and its page on GitHub says: "This project is deprecated in favor of RxJava and RxAndroid."

As we already use <a href="https://github.com/ReactiveX/RxJava" rel="nofollow" target="_blank">RxJava</a> and <a href="https://github.com/ReactiveX/RxAndroid" rel="nofollow" target="_blank">RxAndroid</a> in the development, we decided to try out the Rx approach to implementation of event bus pattern. Of course, we did our best to save a clean api driven by annotations and simple to use event bus library like Otto.

This is how RxBus library was made. This open source library is [available on GitHub](https://github.com/Anadea/RxBus).

## Usage tips

We recommend obtaining a single instance of bus through injection or another appropriate mechanism. Alternatively, you may get a singleton like the following:

```
Bus bus = BusProvider.getInstance();
```

By default, the Bus enforces that all interactions occur on the main thread. To subscribe to an event, you can declare and annotate a method with `@Subscribe`. The method should be public and should take only a single parameter.

```
@Subscribe
public void onEvent(SomeEvent event) {
  // TODO: Do something
}
```

You can also add a filter and an alternate enforcement in your program by creating subscription with the following:

```
CustomSubscriber<SomeEvent> customSubscriber = bus.obtainSubscriber(SomeEvent.class,
  new Consumer<SomeEvent>() {
    @Override
    public void accept(SomeEvent someEvent) throws Exception {
      // TODO: Do something
    }
  })
  .withFilter(new Predicate<SomeEvent>() {
    @Override
    public boolean test(SomeEvent someEvent) throws Exception {
      return "Specific message".equals(someEvent.message);
    }
  })
  .withScheduler(Schedulers.trampoline());
```

To receive events, a class instance would need to register with the bus:

```
bus.register(this);
```

A custom subscriber also needs to register with the bus:

```
bus.registerSubscriber(this, customSubscriber);
```

When appropriate, you would also need to call the `unregister` method:

```
bus.unregister(this);
```

To publish a new event, you can call the `post` method:

```
bus.post(new SomeEvent("Message"));
```

To add RxBus to your project (as a Gradle dependency), use:

```
compile 'com.github.anadea:rxbus:1.0.1'
```

If you have any suggestions on how to improve the RxBus implementation, don't hesitate to [contact us](https://anadea.info/contacts).
