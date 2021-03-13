local _fnc=function (keyUniqEmail,keyHashPass,userKeyStorage,userStringify)
    local redis=redis
    local isUniqEmal=redis.call('get', keyUniqEmail)
    if (isUniqEmal=='true') then
        return redis.error_reply("email is not uniq")
    end
    local isUniqLogin=redis.call('exists', userKeyStorage)
    if (isUniqLogin~=0) then
        return redis.error_reply("username is not uniq")
    end
    local user=cjson.decode(userStringify)
    redis.call('set',keyUniqEmail,'true')
    redis.call('set',keyHashPass,'true')
    redis.call('hset',userKeyStorage,
        'name',cjson.encode(user['name']),
        'access',cjson.encode(user['access']),
        '$$type',cjson.encode(user['$$type'])
    )
    return true
end

return _fnc(KEYS[1],KEYS[2],KEYS[3],ARGV[1])

