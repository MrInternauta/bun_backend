FROM oven/bun

COPY ["package.json",".env", "/usr/src/"]

WORKDIR /usr/src

RUN bun install

COPY [".", "/usr/src/"]

EXPOSE 5000

RUN bun install

CMD bun dev
