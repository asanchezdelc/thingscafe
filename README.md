# Things Cafe

Simple and easy device connection and dashboard for IoT. 

## Requirements
- Redis
- NodeJS
- npm

# Redis docker
```sh
docker run --name redisdb -p 6379:6379 -d redis
```

## Build from source
```
git clone https://github.com/asanchezdelc/thingscafe
cd thingscafe
npm install
npm start
```

# Test

```
mosquitto_pub -h localhost -t v1/thingscafe/things/device-d5f5/data/json -m "temp,f=54"
```


## To Do
- Example code for ESP8266
- Example code for NodeMCU
- Example code for RaspberryPi

