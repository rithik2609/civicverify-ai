from neo4j import GraphDatabase
from neo4j import TrustAll

URI = "neo4j+ssc://b88b00cd.databases.neo4j.io"
USER = "b88b00cd"
PASSWORD = "37nMtdjks3gJrdhAuPrQ6CxD76y1rPzfJSEvg0QFvnc"

driver = GraphDatabase.driver(
    URI,
    auth=(USER, PASSWORD)
)

with driver.session() as session:
    result = session.run(
        "RETURN 'Neo4j Connected' AS message"
    )

    record = result.single()

    if record:
        print(record["message"])

driver.close()