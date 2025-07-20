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
# Install Docker and run the RabbitMQ using docker 

```bash
docker run -d --hostname rabbitmq-host --name rabbitmq-container -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin123 -p 5672:5672 -p 15672:15672  rabbitmq:3-management
```
- login in to browser using http://localhost:15672
- username - admin
- password - admin123

- Package required for the connection of nodejs with rabbitmq
[amqplib documentation](https://www.cloudamqp.com/docs/nodejs.html?utm_source=google&utm_medium=cpc&utm_campaign=19669834282&utm_term=amqplib&gad_source=1&gad_campaignid=19669834282&gbraid=0AAAAApKbGlkLME795MnE5xS_0ZZSngjZ1&gclid=Cj0KCQjwhO3DBhDkARIsANxrhTpwnIa7a1NFuE41M0f5pynzXRXy35FEYE0Xnn51AXAwfM3HG74T9WMaAmefEALw_wcB)

```bash
npm i amqplib
npm i -D @types/amqplib
```




