FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install

ENV PORT = 8001
EXPOSE 8001

CMD ["bun", "run", "dev"]