const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.shopsphere-cluster.ia5xpz7.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS Error:", err);
    } else {
      console.log(addresses);
    }
  }
);