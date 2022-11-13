# Buffer
## Install




## Set configuration with environment variables
### Linux
export CH_MAX_SIZE = 256      // default value, records
export CH_MAX_TIMEOUT =  180   // default value, seconds

## POST DATA
url -X POST 'http://127.0.0.1:3030/ch' -H "Content-Type: application/json" -d '{"id": "213123", "name": "michael", "message": "Hello-bonjour", "timestamp": "1668354858", "table": "str1"}'
