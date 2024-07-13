#!/bin/bash

# MongoDB connection details
user="greatstaff-database-admin"
password="BG2g9sZtAwuqHOan"
dbHost="great-staff-cluster.swbpgja.mongodb.net"
database="great-staff-database"

# Full path to mongoexport
# TODO: Change this to the path where you downloaded the MongoDB Database Tools
mongoExportPath="/path/to/mongoexport"  # Update this path to where mongoexport is installed

# Construct the MongoDB URI
uri="mongodb+srv://${user}:${password}@${dbHost}/${database}"

# List of collections to export
collections=("assignments" "contracts" "demands" "leaves" "projectdemandprofiles" "projects" "projectworkinghours" "skills" "users")

# Loop through all collections and export each
for collection in "${collections[@]}"; do
    echo "Exporting collection $collection..."
    $mongoExportPath --uri="$uri" --collection=$collection --out="${collection}.json"
done

echo "Export completed."