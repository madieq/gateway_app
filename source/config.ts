class Config {
    HTTP_PORT = '11000'
    SOCKET_PORT = '11001'
    CORS = 't'
    DEV = 't'
    REDIS_PREFIX=`local:redis:`
    REDIS_URI=`192.168.1.11:6379;`
    TOKEN_EXPIRE_SEC=`600`
    AUTH_SECRET=`SIJFG8g8924ghRGfg873h`
    MONGO_URI_FULL=`mongodb://admin:123456@192.168.1.11:27017/local?authSource=admin`
}

export let config = new Config