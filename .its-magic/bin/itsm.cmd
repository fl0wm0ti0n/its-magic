@echo off
set "ITSM_STANDALONE_ROOT=G:\workdir\github\sonstiges\gsd_cursor\.its-magic/standalone"
node -e "const v=process.versions.node.split('.').map(Number);process.exit(v[0]>22||(v[0]===22&&(v[1]>19||(v[1]===19&&v[2]>=0)))?0:1)" || (echo [ITSM_NODE_VERSION_UNSUPPORTED] itsm requires Node.js ^>=22.19.0. Found unsupported Node.js. Install Node.js 22.19.0 or newer, then retry. 1>&2 & exit /b 1)
node --experimental-strip-types "G:\workdir\github\sonstiges\gsd_cursor\.its-magic/standalone\apps\cli\src\index.ts" %*
