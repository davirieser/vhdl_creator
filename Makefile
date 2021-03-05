


all:
	@echo "Starting Electron - Please stand by"
	@powershell.exe -file "start_electron.ps1"

package:
	@powershell.exe -file "package_electron.ps1"
