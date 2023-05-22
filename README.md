# Steps to update the environment

- Stop running bot.
- Update env.
- Run following commands:
```
yarn build
yarn start
```

# ENV variable
- Each variable needs to be in oneline ONLY. Don't separate to two lines.

# Example 1. To clear the categories cache
- Stop running bot
- Run
```
NOCACHE_CATS="yes" yarn start
```
