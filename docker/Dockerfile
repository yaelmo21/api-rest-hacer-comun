FROM node:latest

# copy project files
WORKDIR /home/app
COPY . /home/app

# setup entrypoint script
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT [ "/docker-entrypoint.sh" ]

# install dependencies
RUN npm install

EXPOSE 8000
