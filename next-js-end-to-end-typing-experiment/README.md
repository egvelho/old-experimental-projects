# Experimental boilerplate with end-to-end typing (without code generation) for universal Typescript Next.js app.

This is and initial experiment for a programmer-friend fullstack development framework. It tries to create a very DRY approach by defining the API schema and validation (using ```class-validator```) only once in the Next.js ```pages/api``` structure.

This way, and without code generation, that endpoint can be acessed in the client or server by API calls, in a way that the auth is also abstracted by the framework (hooking the request cookies or executing context through ```cls-hooked```). Please refer to ```pages/api``` and ```app/http``` to understand the concepts.

In the end, it was overcomplex and hard to maintain, with very bloated bundles and security-wise problems. Still, it was a fun experiment.
