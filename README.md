## App
Test task for interview

version: 0.1 alpha
Stack: Docker, Clickhouse, NodeJS

Receives data in JSON, buffers and sends to Clickhouse

## TODO
Поправить согласно фидбэка:
1. Дополнительная сортировка плохо влияет на производительность 
2. Не обрабатывается ошибка вставки – возможно потеря данных 
3. Решение не запустить в несколько потоков (используется 1 порт и только локальный буфер) 
4. при перезапуске сервиса данные теряются 


# How it works. Buffer
Accept JSONs by POST request.
Every JSON contains 'table' property, specified table to write

For example:
{
    "id": "2717",
    "name": "Anna",
    "message": "From Syberia with love",
    "table": "str1"
}

## POSTing test DATA with curl
curl -X POST 'http://127.0.0.1:3030/ch' -H "Content-Type: application/json" -d '{"id": "21334123", "name": "Nikolay", "message": "Hello-bonjour", "table": "str1"}'

## Setup

1) Run clickhouse in docker container as official doc says
https://hub.docker.com/r/clickhouse/clickhouse-server/

2) Run container with port mapping, like this:
docker run -d --name some-clickhouse-server -p 8123:8123 -p 9000:9000 --ulimit nofile=262144:262144 clickhouse/clickhouse-server
-p 8123:8123 -p 9000:9000

3) Create test DB and test Table

CREATE DATABASE IF NOT EXISTS testtask  // test db name is 'testtask'

CREATE TABLE IF NOT EXISTS testtask.str1(
    `id` UInt32,
    `name` String,
    `message` String
) ENGINE = MergeTree
ORDER BY id

## Set configuration with environment variables
### Linux


CH_MAX_SIZE = 256      // default value, records
CH_MAX_TIMEOUT =  180   // default value, seconds
CH_DB = 'testtask'      // default value - testtask

CLICKHOUSE_HOST         // default - 'http://localhost:8123'
CLICKHOUSE_USER         // default - 'default'
CLICKHOUSE_PASSWORD     // default - ''
