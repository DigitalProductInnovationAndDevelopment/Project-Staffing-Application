# MongoDB connection details
$user = "greatstaff-database-admin"
$password = "BG2g9sZtAwuqHOan"
$dbHost = "great-staff-cluster.swbpgja.mongodb.net"  # Use the same host as in the export script
$database = "great-staff-database"

# Full path to mongoimport.exe 
# TODO: Change this to the path where you downloaded the MongoDB Database Tools
$mongoImportPath = "/path/to/mongoimport"  # Update this path to where mongoexport is installed

# Construct the MongoDB URI
$uri = "mongodb+srv://${user}:${password}@${dbHost}/${database}"  # Use the same URI format as in the export script

# List of collections to import (should match the exported collections)
$collections = @("assignments", "contracts", "demands", "leaves", "projectdemandprofiles", "projects", "projectworkinghours", "skills", "users")

# Loop through all collections and import each
foreach ($collection in $collections) {
    Write-Host "Importing collection $collection..."
    $command = "& `"$mongoImportPath`" --uri=`"$uri`" --collection=$collection --file=`"${collection}.json`" --drop"
    Invoke-Expression $command
}

Write-Host "Import completed."