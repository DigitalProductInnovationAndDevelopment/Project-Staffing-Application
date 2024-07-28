#!/bin/bash

# MongoDB connection details
user="greatstaff-database-admin"
password="BG2g9sZtAwuqHOan"
dbHost="great-staff-cluster.swbpgja.mongodb.net"
database="great-staff-database"

# Path to MongoDB tools
mongoRestorePath="/path/to/mongorestore"

# Construct the MongoDB URI
uri="mongodb+srv://${user}:${password}@${dbHost}/${database}"

# Base directory where backups are stored
baseBackupDir="path/to/project/Project-Staffing-Application/database_example_state_that_works"

# Find the last (most recent) backup directory
lastBackupDir=$(ls -td ${baseBackupDir}/*/ | head -1)

# Assuming lastBackupDir gives you something like "/path/to/great-staff-database-backup-20240716185328"
# And you know the subdirectory will always match the database name, you can append it directly:
dataToRestoreDir="${lastBackupDir}${database}"

# Alternatively, if the subdirectory name might not always match the database name exactly,
# but you know there will only be one subdirectory, you can dynamically find it like this:
subDirectories=($(find ${lastBackupDir} -mindepth 1 -maxdepth 1 -type d))
if [ ${#subDirectories[@]} -eq 1 ]; then
    dataToRestoreDir=${subDirectories[0]}
else
    echo "Error: Expected exactly one subdirectory in the backup directory."
    exit 1
fi

# Perform restore with the corrected $dataToRestoreDir
echo "Restoring database from ${dataToRestoreDir}..."
$mongoRestorePath --uri="$uri" --drop --dir="$dataToRestoreDir"

echo "Restore completed."