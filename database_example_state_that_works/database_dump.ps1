# MongoDB connection details
$user = "greatstaff-database-admin"
$password = "BG2g9sZtAwuqHOan"
$dbHost = "great-staff-cluster.swbpgja.mongodb.net"  # Renamed from $host to $dbHost
$database = "great-staff-database"

# Full path to mongodump.exe
# TODO: Change this to the path where you downloaded the MongoDB Database Tools
$mongoDumpPath = "path\to\mongodumb"  # Update this path to where mongodump is installed

# Construct the MongoDB URI
$uri = "mongodb+srv://${user}:${password}@${dbHost}/${database}"  # Updated $host to $dbHost

# Backup directory
$backupDir = "path\to\project\database_example_state_that_works\${database}-backup-$(Get-Date -Format 'yyyyMMddHHmmss')"

# Perform backup
Write-Host "Performing backup..."
& "$mongoDumpPath" --uri="$uri" --out="$backupDir"

Write-Host "Backup completed."