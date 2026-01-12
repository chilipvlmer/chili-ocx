#!/usr/bin/env bash
# list-profiles.sh - List all ghost profiles and their status

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}🌶️  Chili OCX Registry - Ghost Profiles${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# List active profiles
echo -e "${CYAN}Active Profiles:${NC}"
ocx ghost profile list || echo "No profiles found"

# Check for archived profiles
ARCHIVE_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx/.archived/profiles"
if [ -d "$ARCHIVE_DIR" ] && [ "$(ls -A $ARCHIVE_DIR 2>/dev/null)" ]; then
    echo -e "\n${CYAN}Archived Profiles:${NC}"
    ls -1 "$ARCHIVE_DIR" | sed 's/\.json$//' | while read -r profile; do
        echo "  - $profile"
    done
else
    echo -e "\n${CYAN}Archived Profiles:${NC} None"
fi

# List branch-specific builds
echo -e "\n${CYAN}Branch Builds:${NC}"
REGISTRY_DIR="/Users/chili/•KOKPIT•/•PROGRAMOWANIE•/chili-ocx"
found=0
for dist in "${REGISTRY_DIR}"/dist-*; do
    if [ -d "$dist" ]; then
        found=1
        branch=$(basename "$dist" | sed 's/^dist-//')
        size=$(du -sh "$dist" 2>/dev/null | cut -f1)
        echo "  - ${branch} (${size})"
    fi
done

if [ $found -eq 0 ]; then
    echo "  None"
fi

echo ""
