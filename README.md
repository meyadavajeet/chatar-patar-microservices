# Chatar Patar
--


Installation 
## install typescript globally
```bash
npm i -g typescript
```

- Intialize the project
```bash
npm init -y

# create typescript file initialize  tsconfig.json file
npx tsc --init
```

Changes required in tsconfig.json file
- change target to - es2020
- change module to - nodenext
- change rootDir to - "./src"
- change outDir to - "./dist"

- changes required in package.json
- change project name
- add type = "module"
- add build command - ``` "build" : "tsc"```
- add start command -``` "start" : "node dist/index.js"```
- add concurrently command - ``` "dev": "concurrently \"tsc -w\" \"nodemon dist/index.js\"" ```

-- install requrired packages
 ``` bash
 npm i express dotenv mongoose

 npm i -D @types/express @types/mongoose @types/dotenv nodemon concurrently 
 ```

 ## For Redis
 - for redis db we will use upstash.com - it is giving me 256mb memory free
 - use hubroot g a/c
 ```bash
 npm i redis
 npm i -D @types/redis
 ```





