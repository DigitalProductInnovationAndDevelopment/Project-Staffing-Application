#!/bin/bash

# MongoDB connection details
user="greatstaff-database-admin"
password="BG2g9sZtAwuqHOan"
dbHost="great-staff-cluster.swbpgja.mongodb.net"
database="great-staff-database"

# Full path to mongoimport
# TODO: Change this to the path where you downloaded the MongoDB Database Tools
mongoImportPath="/path/to/mongoimport"  # Update this path to where mongoimport is installed on your system

# Construct the MongoDB URI
uri="mongodb+srv://${user}:${password}@${dbHost}/${database}"

# List of collections to import (should match the exported collections)
collections=("assignments" "contracts" "demands" "leaves" "projectdemandprofiles" "projects" "projectworkinghours" "skills" "users")

# Loop through all collections and import each
for collection in "${collections[@]}"; do
    echo "Importing collection $collection..."
    $mongoImportPath --uri="$uri" --collection=$collection --file="${collection}.json" --drop
done

echo "Import completed."