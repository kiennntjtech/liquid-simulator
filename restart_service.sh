cp /home/tjtech/backup/.env /home/tjtech/ra-applications/ra-services
cd /home/tjtech/ra-applications/ra-services && pm2 restart /home/tjtech/ra-applications/ra-services/ecosystem.config.js
#test