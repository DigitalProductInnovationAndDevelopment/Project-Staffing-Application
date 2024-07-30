# MongoDB connection details
$user = "greatstaff-database-admin"
$password = "BG2g9sZtAwuqHOan"
$dbHost = "great-staff-cluster.swbpgja.mongodb.net"
$database = "great-staff-database"

# Paths to MongoDB tools
$mongoRestorePath = "path\to\mongorestore"

# Construct the MongoDB URI
$uri = "mongodb+srv://${user}:${password}@${dbHost}/${database}"

# Base directory where backups are stored
$baseBackupDir = "path\to\ptoject\Project-Staffing-Application\database_example_state_that_works"

# Find the last (most recent) backup directory
$lastBackupDir = Get-ChildItem -Path $baseBackupDir -Directory | Sort-Object CreationTime -Descending | Select-Object -First 1

# Assuming $lastBackupDir.FullName gives you something like "C:\...\great-staff-database-backup-20240716185328"
# And you know the subdirectory will always match the database name, you can append it directly:
$dataToRestoreDir = Join-Path -Path $lastBackupDir.FullName -ChildPath $database

# Alternatively, if the subdirectory name might not always match the database name exactly,
# but you know there will only be one subdirectory, you can dynamically find it like this:
# $subDirectories = Get-ChildItem -Path $lastBackupDir.FullName -Directory
# if ($subDirectories.Count -eq 1) {
#     $dataToRestoreDir = $subDirectories[0].FullName
# } else {
#     Write-Host "Error: Expected exactly one subdirectory in the backup directory."
#     exit
# }

# Perform restore with the corrected $dataToRestoreDir
Write-Host "Restoring database from $dataToRestoreDir..."
& "$mongoRestorePath" --uri="$uri" --drop --dir="$dataToRestoreDir"

Write-Host "Restore completed."