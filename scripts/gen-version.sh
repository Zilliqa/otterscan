#! /bin/bash
if [ $# -ne 1 ]; then
    echo "Syntax: gen-version.sh <output_filename>" 2>1
    exit 1
fi
STATUS=$(git status --porcelain)
COMMIT=$(git rev-parse --short HEAD 2>/dev/null)
VERSION=$(git describe --tags 2>/dev/null)
if [ -z "$STATUS" ]; then
    # No changes
    if [ -z $VERSION ]; then
        REPORT="${COMMIT}"
    else
        REPORT="${VERSION}"
    fi
else
    # Changes
    REPORT="${COMMIT}+"
fi
echo "export const OTTERSCAN_VERSION=\"${REPORT}\"" >$1
