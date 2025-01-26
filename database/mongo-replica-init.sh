#!/bin/bash
set -e

# Initialize replica set function
initialize_replica_set() {
    echo "Initializing replica set"
    mongo --eval 'rs.initiate({_id: "my-replica-set", members: [{ _id: 0, host: "mongodb-node1:27017" }, { _id: 1, host: "mongodb-node2:27017" }, { _id: 2, host: "mongodb-node3:27017" }]})'
}

# Main execution
if [ "$HOSTNAME" = "mongodb-node1" ]; then
    # Wait a bit for the server to start
    sleep 10
    # Initialize the replica set if the script is running on the first node
    initialize_replica_set
fi

# Hand over control to the CMD
exec "$@"
