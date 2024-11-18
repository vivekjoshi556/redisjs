# RedisJS
This is a JS implementation of Redis from scratch strictly for learning purposes. I am doing this as part of a [Codecrafters](http://codecrafters.io) challenge.

This is an attempt to learn about various design patterns and using them is real world scenarios. If you have any suggestions about what I could have done better please create an issue.


## Overview
There are multiple pieces in this challenge, but primarily it is composed of `basic` and `extensions`.
### Basic:
This is the basic functionalities of redis like starting the redis server and implementing basic commands and features like:
- Ping
- Echo
- Set (with and without expiry)
- Get
- Handling concurrent Clients.

### Extensions:
Then there are extensions. These are specific features that we have to implement. As of today there are 4 extensions as `beta` for Redis.
- Replication
- Transactions
- Streams
- RDB Persistence

## Implementation Status:
I have already completed the Basic, Replication & Transactions stages. I will be working on Streams next.
