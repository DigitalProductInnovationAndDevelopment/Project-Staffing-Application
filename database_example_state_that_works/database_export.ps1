# MongoDB connection details
$user = "greatstaff-database-admin"
$password = "BG2g9sZtAwuqHOan"
$dbHost = "great-staff-cluster.swbpgja.mongodb.net"  # Renamed from $host to $dbHost
$database = "great-staff-database"

# Full path to mongoexport.exe
# TODO: Change this to the path where you downloaded the MongoDB Database Tools
$mongoExportPath = "/path/to/mongoimport"  # Update this path to where mongoexport is installed

# Construct the MongoDB URI
$uri = "mongodb+srv://${user}:${password}@${dbHost}/${database}"  # Updated $host to $dbHost

# List of collections to export
$collections = @("assignments", "contracts", "demands", "leaves", "projectdemandprofiles", "projects", "projectworkinghours", "skills", "users")

# Loop through all collections and export each
foreach ($collection in $collections) {
    Write-Host "Exporting collection $collection..."
    $command = "& `"$mongoExportPath`" --uri=`"$uri`" --collection=$collection --out=`"${collection}.json`""
    Invoke-Expression $command
}

Write-Host "Export completed."