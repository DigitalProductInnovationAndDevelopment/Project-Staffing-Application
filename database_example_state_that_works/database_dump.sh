#!/bin/bash

# MongoDB connection details
user="greatstaff-database-admin"
password="BG2g9sZtAwuqHOan"
dbHost="great-staff-cluster.swbpgja.mongodb.net"
database="great-staff-database"

# Path to mongodump (assuming mongodump is in the system's PATH)
# If mongodump is not in your PATH, specify the full path here
mongoDumpPath="mongodump"

# Construct the MongoDB URI
uri="mongodb+srv://${user}:${password}@${dbHost}/${database}"

# Backup directory
# Note: Uses the `date` command to format the timestamp
backupDir="oath/to/project/Project-Staffing-Application/database_example_state_that_works/${database}-backup-$(date +%Y%m%d%H%M%S)"

# Perform backup
echo "Performing backup..."
$mongoDumpPath --uri="$uri" --out="$backupDir"

echo "Backup completed."