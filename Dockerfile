From alpine:3.4
MAINTAINER Roney Thomas <roneythomas6@gmail.com>

# Instal node and other dependencies
RUN echo "@edge http://nl.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
    && apk update \
    && apk upgrade \
    && apk --no-cache add libc6-compat \
    && apk --no-cache add ca-certificates \
    && update-ca-certificates \
    && apk --no-cache add openssl \
    && wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://raw.githubusercontent.com/sgerrand/alpine-pkg-glibc/master/sgerrand.rsa.pub \
    && wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.23-r3/glibc-2.23-r3.apk \
    && apk add glibc-2.23-r3.apk \
    && apk add --no-cache nodejs@edge

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install yarn
RUN wget https://yarnpkg.com/latest.tar.gz \
    && mkdir yarn \
    && tar xvxf latest.tar.gz \
    && rm -rf latest.tar.gz \
    && mv dist/* yarn/

# Add yarn to path
ENV PATH="$PATH:/usr/src/app/yarn/bin"

# Copy app
COPY restify/ /usr/src/app/

# Run app dependencies
RUN yarn

# Expose port and run node app
EXPOSE 8080
CMD [ "yarn", "run", "start" ]