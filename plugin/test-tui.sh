#!/bin/bash
# RFC-004 Manual TUI Testing Script
# This script helps verify the plugin log fix

echo "🌶️ RFC-004 TUI Testing Helper"
echo "=============================="
echo ""

# Function to check log file
check_log() {
    if [ -f /tmp/chili-ocx-plugin.log ]; then
        echo "✅ Log file exists"
        echo "📝 Recent entries:"
        tail -5 /tmp/chili-ocx-plugin.log
    else
        echo "❌ Log file not found at /tmp/chili-ocx-plugin.log"
    fi
}

# Function to clear log
clear_log() {
    rm -f /tmp/chili-ocx-plugin.log
    echo "🗑️  Log file cleared"
}

# Main menu
case "$1" in
    "check")
        echo "Checking log file..."
        check_log
        ;;
    "clear")
        echo "Clearing log file..."
        clear_log
        ;;
    "normal")
        echo "🧪 TEST 10.2: Normal Mode (DEBUG not set)"
        echo "=========================================="
        echo ""
        echo "Current DEBUG status: ${CHILI_OCX_DEBUG:-not set}"
        echo ""
        if [ "$CHILI_OCX_DEBUG" = "1" ]; then
            echo "⚠️  WARNING: CHILI_OCX_DEBUG is set to 1"
            echo "   Run: unset CHILI_OCX_DEBUG"
            echo "   Then restart OpenCode"
            exit 1
        fi
        echo "✅ DEBUG mode is OFF (correct for this test)"
        echo ""
        echo "Steps:"
        echo "1. Clear the log file (run: $0 clear)"
        echo "2. In OpenCode TUI, run: /pepper-status"
        echo "3. Observe: NO log messages should appear on TUI"
        echo "4. Check log file (run: $0 check)"
        echo "5. Expected: Log file should have entries"
        echo ""
        ;;
    "debug")
        echo "🧪 TEST 10.3: Debug Mode (DEBUG=1)"
        echo "=================================="
        echo ""
        echo "Current DEBUG status: ${CHILI_OCX_DEBUG:-not set}"
        echo ""
        if [ "$CHILI_OCX_DEBUG" != "1" ]; then
            echo "⚠️  DEBUG mode not enabled"
            echo "   Run: export CHILI_OCX_DEBUG=1"
            echo "   Then restart OpenCode"
            exit 1
        fi
        echo "✅ DEBUG mode is ON (correct for this test)"
        echo ""
        echo "Steps:"
        echo "1. Clear the log file (run: $0 clear)"
        echo "2. In OpenCode TUI, run: /pepper-status"
        echo "3. Observe: Log messages SHOULD appear on console"
        echo "4. Check log file (run: $0 check)"
        echo "5. Expected: Log file should also have entries"
        echo ""
        ;;
    *)
        echo "Usage: $0 {normal|debug|check|clear}"
        echo ""
        echo "Commands:"
        echo "  normal - Instructions for Test 10.2 (normal mode)"
        echo "  debug  - Instructions for Test 10.3 (debug mode)"
        echo "  check  - View recent log entries"
        echo "  clear  - Clear the log file"
        echo ""
        echo "Example workflow:"
        echo "  1. ./test-tui.sh normal"
        echo "  2. ./test-tui.sh clear"
        echo "  3. [Run /pepper-status in OpenCode]"
        echo "  4. ./test-tui.sh check"
        exit 1
        ;;
esac
