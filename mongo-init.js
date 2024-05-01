db = db.getSiblingDB("admin");

db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [{ role: "readWriteAnyDatabase", db: "admin" }],
});

const dbName = "thesis";

db = db.getSiblingDB(dbName);

db.createUser({
  user: "admin",
  pwd: "admin123",
  roles: [{ role: "readWrite", db: "thesis" }],
});
