local hgetall=function (key)
    local u=redis.call('hgetall',key);
    local res={}
    for index, value in ipairs(u) do
        if index%2==1 then
            res[value]=cjson.decode(u[index+1])
        end
    end
    return cjson.encode(res)
end
-- ARGV[1]
-- KEYS[1]

return hgetall(KEYS[1])

