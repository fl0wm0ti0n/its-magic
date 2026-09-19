@echo off
set "ITSM_STANDALONE_ROOT=G:\workdir\github\sonstiges\gsd_cursor\.its-magic/standalone"
node --experimental-strip-types "G:\workdir\github\sonstiges\gsd_cursor\.its-magic/standalone\apps\cli\src\index.ts" %*
