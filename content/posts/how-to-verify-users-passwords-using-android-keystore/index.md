---
title: How to Verify Users' Passwords Using the Android KeyStore
slug: how-to-verify-users-passwords-using-android-keystore
draft: false
publishDate: 2019-01-08T00:00:00.000Z
image: Security-android.jpg
og_image: Security-android.jpg
description: Security is crucial for users, and developers must prioritize it.
  This post highlights a specific Android security use case developers may
  encounter.
promote:
  promote: false
top: false
authors: []
categories:
  - development
industries: []
---
Everybody knows that security is a very important issue for users and therefore developers should take a proper care of it. There are many posts about Android security in the Internet - some of them explain difference between cryptography algorithms, whilst others are dedicated to basics of Android security. In this post I will spotlight a single use case Android developers may face in their work.

Let's assume that we develop an application and we need to identify users - I am talking about a regular login screen. We are developing a standalone application and so we cannot rely on backend user validation capability as we usually do. Of course, we need a secure authorization flow.

![Knock Knock](Knock_Knock.jpg)

Saving users' passwords is a bad practice and none of developers want to be responsible for compromising users' credentials. The point is that many users are likely to use the same password for many services. As a result, a compromised password in our application may be a key to many other services.

## Resolving a security task in Android SDK

Let's try to find out what we can use to resolve a security task in Android SDK. The first tool that springs in our mind is the KeyStore API introduced in Android 4.3. We can use the KeyStore as a container to store cryptographic keys. The most significant benefit of the KeyStore is that it has access to Android System Keystore and it is maintained by a system process. In this way, we delegate keeping cryptographic keys to a system service.

What we are going to do:

1. Generate a key pair for asynchronous encryption and put it in the KeyStore.
2. Sign user password with Digital Signature. The Signature procedure will be initiated with the key from step 1.
3. Verify another user password with the Signature from step 2.

## Stop talking and let's start coding!

First, we need to create a key pair with RSA specific parameters. To do this, we should start from creating parameters for RSA key, however we should do it a bit differently for Android M and above.

This is how we obtain specifications for Android SDK below M version:

<script src="https://gist.github.com/sanya5791/b3c0e3c22dc5c7d97505bfd1c6f71503.js"></script>

And this chunk of code for Android version M and above:

<script src="https://gist.github.com/sanya5791/2a09783133398dd99594589344037ae1.js"></script>

Besides RSA specific parameters, we should know the following: **"AndroidKeyStore"** will be used to obtain the key pair from KeyStore and Certificate related to it. The key pair is going to be valid from 'start' date to 'end' date.

Having RSA specifications we can generate a KeyPair:

<script src="https://gist.github.com/sanya5791/fa57639b14ad6030cfafe98608a7dcb0.js"></script>

KeyPairGenerator is used to generate the KeyPair and add it to the Android KeyStore. We get an instance of KeyPairGenerator for RSA algorithm and pass **"AndroidKeyStore"** parameter to ensure to use Android System Keystore. Then, we initialize KeyPairGenerator with specifications we set before and eventually generateKeyPair method generates KeyPair and puts it into Android System Keystore.

New KeyPair will be generated every time we call 'generateKeyPair()' method. That's why, before generating another KeyPair, we should make sure that AndroidKeyStore doesn't already have a KeyPair with the same alias to prevent overriding last KeyPair and losing existing certificates.

We have the RSA KeyPair generated and ready to use it. Note, that we will use only private key for our purpose. Let's start using our AndroidKeyStore!

<script src="https://gist.github.com/sanya5791/175c09553aa712a6be393ee61d9fdd4b.js"></script>

First, we obtain an instance of the KeyStore and pass **"AndroidKeyStore"** parameter to ensure to use Android System Keystore. Then we should finish initialization of the KeyStore with "load()" method. As soon as we have Android System Keystore, we can get the keys we generated before with `ALIAS_VERIFY_SIGNATURE` and cast the keys to the required type.

And now, let's suppose that a new user is created within our application and we have password in plain text. Do you remember that we are not going to persist user plain password anywhere for our authorization process? But we can use digital Signature facility provided with Signature class. Let's get down to signing user passwords.

<script src="https://gist.github.com/sanya5791/9ef1f17c25ca7cc4da385d96cfa2a8ef.js"></script>

In this method we use Signature class and it doesn't encrypt anything, but it signs our password with a private key from the Android KeyStore. As a result, we have a signature of the password and it is not sensitive information so that we can save the signature in SharedPreferences as it is. Please consider that we initiate Signature class for signing operation.

We are ready to perform the last step and to verify if another user password matches a registered one.

<script src="https://gist.github.com/sanya5791/abef3afc64c4c2cc29fd91b63c6f5f67.js"></script>

Again, we use Signature class facility to verify if provided input string and original password are identical. However, this time Signature class is initiated for verification purpose.

To wrap up, we have a secure way of data verification without persisting any sensitive information at all. Also, generated certificate is not kept by our application but by the Android KeyStore so it is senseless to hack the application to find a signing certificate.

## References

In the post I used just a few chunks of code to express the whole idea, but you can dive into details of the whole class on GitHab: <a href="https://github.com/sanya5791/KeystoreSamples/blob/master/app/src/main/java/com/akhutornoy/tastekeystore/security/DataSignatureVerifier.kt" target="_blank">KeystoreSamples</a>.

The following resources were used in the article:
* <a href="https://developer.android.com/training/articles/keystore" target="_blank">Android keystore system</a>
* <a href="https://github.com/googlearchive/android-BasicAndroidKeyStore" target="_blank">googlesamples/android-BasicAndroidKeyStore</a>
