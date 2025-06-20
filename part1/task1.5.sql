INSERT INTO Users (username, email, password_hash, role) VALUES ('alice123', 'alice@example.com', 'hashed123', 'owner');
INSERT INTO Users (username, email, password_hash, role) VALUES ('bobwalker', 'bob@example.com', 'hashed456', 'walker');
INSERT INTO Users (username, email, password_hash, role) VALUES ('carol123', 'carol@example.com', 'hashed789', 'owner');
INSERT INTO Users (username, email, password_hash, role) VALUES ('merc123', 'merc@example.com', 'hashed012', 'walker');
INSERT INTO Users (username, email, password_hash, role) VALUES ('user123', 'user@example.com', 'hashed345', 'owner');
INSERT INTO Dogs (owner_id, name, size) VALUES (owner, 'Max', 'medium') WHERE owner IN (SELECT user_id FROM Users WHERE username = 'alice123');
INSERT INTO Dogs (owner_id, name, size) VALUES (owner, 'Bella', 'small') WHERE owner IN (SELECT user_id FROM Users WHERE username = 'carol123');
INSERT INTO Dogs (owner_id, name, size) VALUES (owner, 'Sheep', 'large') WHERE owner IN (SELECT user_id FROM Users WHERE username = 'alice123');
INSERT INTO Dogs (owner_id, name, size) VALUES (owner, 'Cat', 'medium') WHERE owner IN (SELECT user_id FROM Users WHERE username = 'user123');
INSERT INTO Dogs (owner_id, name, size) VALUES (owner, 'Duck', 'small') WHERE owner IN (SELECT user_id FROM Users WHERE username = 'carol123');
INSERT INTO WalkRequests ()