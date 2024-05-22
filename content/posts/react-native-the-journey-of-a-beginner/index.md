---
title: "React Native: The Journey of a Beginner "
breadcrumbs: " React Native Beginner Experience"
draft: false
publishDate: 2018-03-12T00:00:00Z
image: React-native-app.jpg
og_image: React-native-app.jpg
description: React Native is, perhaps, the most interesting and fast-evolving
  platform. Today you can create a new project based on its latest version, and
  in just a few months it will get outdated for a few releases. And if a year
  ago React Native was quite a raw product, now there are lots of plugins for
  dealing with native components as well as common React components.
promote:
  promote: false
top: false
authors:
  - anastasiya-bakuta
categories:
  - development
industries: []
---
<p align="right"><sub>"If you sit by the riverbank for a long time,<br>
you will see the dead body of the framework,<br>
which you have long wanted to learn, floating by."</sub></p>
<p align="right"><sub><sup>Chinese folk wisdom</sup></sub></p>

React Native is, perhaps, the most interesting and fast-evolving platform. Today you can create a new project based on its latest version, and in just a few months it will get outdated for a few releases. And if a year ago React Native was quite a raw product, now there are lots of plugins for dealing with native components as well as common React components.

## Sources of information: where to start?

I recommend the book "Learning React Native: Building Native Mobile Apps with JavaScript" by Bonnie Eisenman. Despite the fact that the examples from the book are written using outdated syntax, it can be perfectly used as a guide to learning the basic principles of building applications on react-native. The book describes the entire process of creating an application, right up to the deploy to the store and provides a review of individual components: how and why to use them. The examples will help to strengthen the acquired knowledge - as copy-paste does not work here, you will have to rethink and rewrite them in a new way.

The next by importance source is: <a href="http://reactnative.dev/docs/getting-started.html" target="_blank">documentation</a>. What is great here is that it is up to date. All new releases are described. All outdated methods are specified. Choose the tab "Building Projects with Native Code" and here we go!..

Well, and by no means an important hub for a react-native developer: <a href="https://stackoverflow.com/" rel="nofollow" target="_blank">stackoverflow.com</a>.

## Let's make up the toolset for react

The most essential and commonly used React modules:

**1. Redux**

  * <a href="https://github.com/reactjs/react-redux" rel="nofollow" target="_blank">react-redux</a>,
  * <a href="https://github.com/evgenyrodionov/redux-logger" rel="nofollow" target="_blank">redux-logger</a> - an indispensable tool for debugging,
  * <a href="https://github.com/redux-saga/redux-saga" rel="nofollow" target="_blank">redux-saga</a> - the best solution for managing side effects.

**2. Selectors**

* <a href="https://github.com/reactjs/reselect" rel="nofollow" target="_blank">reselect</a> - a library for selecting data from the application state and arranging them in the desired structure. It is convenient to take this logic out of the reducers and views to a special place.

**3. <a href="https://github.com/facebook/jest" rel="nofollow" target="_blank">Jest</a>** - a testing solution, it goes out of the box. The main thing is not to neglect and write tests =)

**4. <a href="https://github.com/eslint/eslint" rel="nofollow" target="_blank">Eslint</a>** - a tool for unifying the coding style, as well as identifying silly and/or syntax errors.

## RN utilities

The existing libraries for react-native may not remain unmentioned as they undoubtedly make developer's life easier and let you avoid reinventing the wheel:

* <a href="https://github.com/crazycodeboy/react-native-splash-screen" rel="nofollow" target="_blank">react-native-splash-screen</a> - creating a splash screen,
* <a href="https://github.com/entria/react-native-fontawesome" rel="nofollow" target="_blank">react-native-fontawesome</a> - using Font Awesome icons from icon font,
* <a href="https://github.com/ArnaudRinquin/react-native-radio-buttons" rel="nofollow" target="_blank">react-native-radio-buttons</a> - customizable radio-buttons,
* <a href="https://github.com/jeanregisser/react-native-slider" rel="nofollow" target="_blank">react-native-slider</a> - a customizable range input slider,
* <a href="https://github.com/leecade/react-native-swiper" rel="nofollow" target="_blank">react-native-swiper</a> - implementing a small gallery or slides,
* <a href="https://github.com/jemise111/react-native-swipe-list-view" rel="nofollow" target="_blank">react-native-swipe-list-view</a> - a listview where the rows can be swiped to reveal additional options.

To learn how to use the camera, photo/video library, downloading and sharing, check a nice <a href="https://medium.com/react-native-training/mastering-the-camera-roll-in-react-native-13b3b1963a2d" rel="nofollow" target="_blank">article on medium</a> and the following libraries:

* <a href="https://github.com/react-community/react-native-image-picker" rel="nofollow" target="_blank">react-native-image-picker</a> - using photos and videos from the phone library,
* <a href="https://github.com/react-native-community/react-native-camera" rel="nofollow" target="_blank">react-native-camera</a> - work with camera,
* <a href="https://github.com/react-native-community/react-native-video" rel="nofollow" target="_blank">react-native-video</a> - video player.

The last three libraries require additional permissions on the phone, such as: access to the library, camera, local data storage. It should be noted that these permissions will be automatically requested from the user during app installation. The exception is the new (above the 6th) versions of Android. Therefore, we need to request the permission when an application wants to access related services (<a href="https://dzone.com/articles/android-runtime-permissions" rel="nofollow" target="_blank">and that's why</a>). There is an example in the <a href="https://react-native.org/doc/permissionsandroid.html" rel="nofollow" target="_blank">documentation</a> that can be turned into a small library:

```
import { PermissionsAndroid, Platform } from 'react-native'

export const requestExternalStoragePermission = async (onSuccess, onError) => {
 // only for Android 6 and greater
 if ((Platform.OS === 'android') && (Platform.Version > 22)) {
  try {
   const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
     title: 'App read external storage Permission',
     message: `App needs access to your external storage
          so you can take keep your data.`
    }
   )
   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    onSuccess()
   } else {
    onError()
   }
  } catch (err) {
   console.warn(err)
  }
 } else {
  onSuccess()
 }
}
```

Here you can also store requests for access to the microphone and camera.

As you have probably noticed in the above example, we use the <a href="https://react-native.org/doc/platform-specific-code.html" rel="nofollow" target="_blank">Platform</a> module, which allows you to implement platform specific things. The most simple and wide-spread example is setting the status bar height:

Android (the Facebook app, for example):

![Android top header height](top_android.jpg)

iPhone (the Facebook app, for example):

![iOS top header height](top_ios.jpg)

The point is that, when calculating the screen height, we take the actual height of the device screen, however the real area available for the Android app is reduced by the height of the header at 20px (see the topmost bar in the picture). While in iOS the "header" overlays the application and does not take up additional space.

By the way, a feature of the React Native markup is the ability to easily get the height and width of the screen using the <a href="https://react-native.org/doc/dimensions.html" rel="nofollow" target="_blank">Dimensions</a> module:

```
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
```

Well, it's easy to get used to marking up with flexes. It is important to keep in mind that if the block has no specified width, height or flex > 0, then all internal elements will not be shown (!).

I can not help but mention one more thing that you will certainly use in your application - <a href="https://blog.bam.tech/developper-news/change-your-react-native-app-icons-in-a-single-command-line" rel="nofollow" target="_blank">generating icons</a> for Android and iOS applications. You need a thousand and one of them to make your application look beautiful on any device. Fortunately, having Node 6, ImageMagick and the original image of at least 200x200 pixels, you can get every imaginable icons through the command line. In <strike>two words</strike> three commands:

```
npm install -g yo generator-rn-toolbox
brew install imagemagick
yo rn-toolbox:assets --icon <path to your icon>
```

## Additional JavaScript libraries:

* <a href="http://ramdajs.com/" rel="nofollow" target="_blank">Ramda</a> - the useful stuff here is dealing with different data structures, lenses;
* <a href="https://momentjs.com/" rel="nofollow" target="_blank">Moment</a> - manipulations with dates.

Since the code is executed by JavaScript, there can be any set of libraries of the developer's choice.

I could finish my article here by adding a few pretentious phrases like "everything works out of the box," "a large community," "a huge number of plugins." However, the reality is that the first impression can be deceiving and it is necessary to go a long way in [iOS app development](https://anadea.info/services/mobile-development/ios-development) and [Android app development](https://anadea.info/services/mobile-development/android-development) before getting a viable application that solves a real customer's problem.

{{< advert >}}Related read: [Immersion in React Native: Navigation, Offline Mode, Push Notifications](https://anadea.info/blog/immersion-into-react-native){{< /advert >}}

## Pitfalls:

Possible errors in iOS:

* **When creating a build in XCode, the build gets to Other Items,** which makes it impossible to submit it to the AppStore.

The error occurs because of the additional libraries that you use in the project. When you create a new build, they are processed not as libraries, but as independent projects.

Solution: in all projects that are in the Library, you need to set:

```
"Build Setting": Skip install = yes`
```

* **Missing project updates after making changes, "hang ups" and other unpredictabilities.**

A possible reason is that the "clean project" in XCode does not completely remove the temporary files it created.

Solution: delete the temporary files manually. They are in the directory:

```
cd /Users/[local machine]/Library/Developer/Xcode/DerivedData/
```

* **When creating the Archive for the AppStore, XCode swears at duplicate files.**

This can happen if you use pod and React with its components inside it, as well as some of them directly from node_modules.

Solution: exclude files from the build by adding to ios/Podfile:

```
post_install do |installer|
 installer.pods_project.targets.each do |target|
  if target.name == "React"
   target.remove_from_project
  end
 end
end
```

For Android, it is desirable to bring all the libraries used in the project to one version.

## Conclusion

<p align="right"><sub>A journey of a thousand miles begins with a single step.</sub></p>

Developing applications in React Native is an amazing process filled with new discoveries and the joy of how things can be built for other platforms in a different way. This is a new, yet emerging world where you are a pioneer, even if sometimes a pioneer of documentation.

Having mastered the basics, you can start designing your first application, asking yourself more and more new questions:

* What data should we store in the local storage?
* If the application is available online, how should it behave when there is no Internet connection?
* At what point do we receive/send data?
* What should the user see at this moment?
* How and which error messages should we display?
* What are the key features and functionalities that the application should have?
* What is the target audience for the application?
* What platform(s) should the application be built for?
* How can we ensure the security of the application and the user's data?
* What are the potential risks and challenges in developing and launching the application?
