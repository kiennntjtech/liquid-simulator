FROM 925846982767.dkr.ecr.ap-southeast-1.amazonaws.com/build-image:services-run-2.0
WORKDIR /usr/src/app
COPY ./ .
CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]