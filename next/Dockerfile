# build environment
FROM node:18 as build
ENV NODE_OPTIONS "--max_old_space_size=2048"
WORKDIR /app
#ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

CMD ["yarn", "start", "-p", "3000"]

