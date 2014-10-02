// Register your own facebook-app
module.exports = {
  server: {
    port: 8080
  },
  fbcreds:{
    clientID: "",
    clientSecret: "",
    callbackURL: "http://localhost:8080/_sys/auth/fb/callback"
  },
  user: [
    { mail: 'bla@gmail.com', path: 'D:\\' },
    { mail: 'blub@yahoo.de', path: 'D:\\Apps' }
  ],
  secret: 'secrääht!'
}
