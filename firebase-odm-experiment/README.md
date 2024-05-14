# An experiment with universal typescript end-to-end typed ODM for Firebase Realtime Database REST API.

Experimental and incomplete code-first approach to represent and query a Firebase Realtime Database. The schema is generated based in a class with decorated properties, similar to what TypeORM does. The code is universal, which means that it can be used inside a REST API as a normal ODM with server permissions, or direct in the client, avoiding unnecessary load in the server to query simple data.

# Defining the schema

```typescript
// rules.ts

import {
  Node,
  IsNotEmpty,
  IsString,
  Read,
  Write,
  Child,
  IndexOn,
  request,
} from "firebase-odm-experiment";

@Node("$uid")
class User {
  @IsNotEmpty()
  @IsString({ message: "Some message" })
  name!: string;

  @IsNotEmpty()
  @IsString()
  surname?: string;
}

@Node("users")
class Users {
  @Read()
  @Write()
  @Child(User)
  $uid!: User;
}

@Node("rules")
class Rules {
  @Child(Users)
  @Read()
  @Write()
  @IndexOn(["teste"])
  users!: Users;
}

const rules = new Rules();
export default rules;
```

After creating the schema class, execute ```npm run generate-schema path/to/rules.tsx path/to/firebase-rules.json``` to generate the corresponding Firebase rules. Now, the rules file can be passed to Firebase using the prefered method.

# Usage

This lib uses the Firebase Realtime Database REST API instead of the WebSocket tunnel. To execute a simple query:

```typescript
import { request } from "firebase-odm-experiment";
import rules from './rules.ts';

const { data } = await request(rules, "users").query().orderBy("name").get();
console.log(data);
```

This way, the ```data``` var have the fully typed response for the query. Enjoy!
