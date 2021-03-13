class Config {
    HTTP_PORT = '11000'
    SOCKET_PORT = '11001'
    CORS = 't'
    DEV = 't'
    REDIS_PREFIX=`local:redis:`
    REDIS_URI=`192.168.1.11:6379;`
    TOKEN_EXPIRE_SEC=`600`
}

export let config = new Config